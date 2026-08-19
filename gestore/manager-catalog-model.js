(function exposeManagerCatalogModel(root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SentieriManagerCatalogModel = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createManagerCatalogModel() {
  "use strict";

  const SCHEMA = "sentieri/manager-catalog-demo/v1";
  const PUBLICATION_STATUSES = new Set(["published", "draft", "retired"]);
  const EDITABLE_FIELDS = [
    "code",
    "name",
    "difficulty",
    "durationMinutes",
    "lengthMeters",
    "elevationGainMeters",
    "elevationLossMeters",
    "walking",
    "mountainBike",
    "eBike",
    "horse"
  ];

  function emptyState() {
    return { schema: SCHEMA, overrides: {}, customTrails: [], audit: [] };
  }

  function normalizeState(value) {
    if (value?.schema !== SCHEMA) return emptyState();
    return {
      schema: SCHEMA,
      overrides: value.overrides && typeof value.overrides === "object" ? value.overrides : {},
      customTrails: Array.isArray(value.customTrails) ? value.customTrails : [],
      audit: Array.isArray(value.audit) ? value.audit : []
    };
  }

  function difficultyFromSource(properties = {}) {
    const label = `${properties.difficulty || properties.difficultyLabel || properties.difficultyCode || ""}`.toLocaleLowerCase("it-IT");
    if (/esper|eea|\bee\b/.test(label)) return "expert";
    if (/diffic|sport|\be\b/.test(label)) return "hard";
    if (/medio|escursion/.test(label)) return "medium";
    if (/facile|turist|\bt\b/.test(label)) return "easy";
    return "not-specified";
  }

  function normalizeBaseTrail(properties = {}) {
    return {
      id: `${properties.id || properties.canonicalTrailId || ""}`,
      code: properties.code || "",
      name: properties.name || "Percorso senza nome",
      difficulty: difficultyFromSource(properties),
      durationMinutes: finiteOrNull(properties.durationMinutes),
      lengthMeters: finiteOrNull(properties.lengthMeters),
      elevationGainMeters: finiteOrNull(properties.elevationGainMeters),
      elevationLossMeters: finiteOrNull(properties.elevationLossMeters),
      walking: properties.walking !== false,
      mountainBike: Boolean(properties.mountainBike),
      eBike: Boolean(properties.eBike),
      horse: Boolean(properties.horse),
      source: properties.primarySource || "Fonte non indicata",
      official: Boolean(properties.official),
      geometryAvailable: true,
      custom: false,
      publicationStatus: "published"
    };
  }

  function finiteOrNull(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }

  function editableValues(fields = {}) {
    return EDITABLE_FIELDS.reduce((result, field) => {
      if (Object.prototype.hasOwnProperty.call(fields, field)) result[field] = fields[field];
      return result;
    }, {});
  }

  function effectiveCatalog(baseTrails, stateValue) {
    const state = normalizeState(stateValue);
    const base = (Array.isArray(baseTrails) ? baseTrails : []).map((item) => {
      const normalized = item.geometryAvailable === true && item.custom === false ? item : normalizeBaseTrail(item);
      const override = state.overrides[normalized.id] || {};
      const publicationStatus = PUBLICATION_STATUSES.has(override.publicationStatus)
        ? override.publicationStatus
        : normalized.publicationStatus;
      return {
        ...normalized,
        ...editableValues(override),
        publicationStatus,
        lastReason: override.lastReason || null,
        lastChangedAt: override.lastChangedAt || null
      };
    });
    const custom = state.customTrails.map((item) => ({
      ...item,
      source: "Inserimento manuale gestore",
      geometryAvailable: Boolean(item.geometryAvailable),
      custom: true,
      publicationStatus: PUBLICATION_STATUSES.has(item.publicationStatus) ? item.publicationStatus : "draft"
    }));
    return [...base, ...custom];
  }

  function validateFields(fields = {}) {
    const errors = [];
    if (!`${fields.name || ""}`.trim()) errors.push("name");
    ["durationMinutes", "lengthMeters", "elevationGainMeters", "elevationLossMeters"].forEach((field) => {
      if (fields[field] !== null && (!Number.isFinite(Number(fields[field])) || Number(fields[field]) < 0)) errors.push(field);
    });
    if (!["not-specified", "easy", "medium", "hard", "expert"].includes(fields.difficulty)) errors.push("difficulty");
    return errors;
  }

  function saveManualTrail(stateValue, baseTrails, trailId, fields, reason, changedAt, customId) {
    const state = normalizeState(stateValue);
    const cleanReason = `${reason || ""}`.trim();
    const cleanFields = editableValues(fields);
    if (validateFields(cleanFields).length) throw new Error("INVALID_FIELDS");
    if (!cleanReason) throw new Error("REASON_REQUIRED");
    const existingCustomIndex = state.customTrails.findIndex((item) => item.id === trailId);
    const now = changedAt || new Date().toISOString();
    if (existingCustomIndex >= 0) {
      const existing = state.customTrails[existingCustomIndex];
      state.customTrails[existingCustomIndex] = {
        ...existing,
        ...cleanFields,
        updatedAt: now,
        lastReason: cleanReason
      };
      state.audit.push({ trailId, action: "manual-update", reason: cleanReason, changedAt: now });
      return state;
    }
    const baseExists = (Array.isArray(baseTrails) ? baseTrails : []).some((item) => item.id === trailId);
    if (baseExists) {
      state.overrides[trailId] = {
        ...(state.overrides[trailId] || {}),
        ...cleanFields,
        lastReason: cleanReason,
        lastChangedAt: now
      };
      state.audit.push({ trailId, action: "manual-correction", reason: cleanReason, changedAt: now });
      return state;
    }
    const id = customId || `manager-${Date.now()}`;
    state.customTrails.push({
      id,
      ...cleanFields,
      source: "Inserimento manuale gestore",
      official: false,
      geometryAvailable: false,
      custom: true,
      publicationStatus: "draft",
      createdAt: now,
      updatedAt: now,
      lastReason: cleanReason
    });
    state.audit.push({ trailId: id, action: "manual-create", reason: cleanReason, changedAt: now });
    return state;
  }

  function setPublicationStatus(stateValue, trailId, status, reason, changedAt) {
    if (!PUBLICATION_STATUSES.has(status)) throw new Error("INVALID_STATUS");
    const cleanReason = `${reason || ""}`.trim();
    if (!cleanReason) throw new Error("REASON_REQUIRED");
    const state = normalizeState(stateValue);
    const now = changedAt || new Date().toISOString();
    const customIndex = state.customTrails.findIndex((item) => item.id === trailId);
    if (customIndex >= 0) {
      if (status === "published" && !state.customTrails[customIndex].geometryAvailable) throw new Error("GEOMETRY_REQUIRED");
      state.customTrails[customIndex] = {
        ...state.customTrails[customIndex],
        publicationStatus: status,
        updatedAt: now,
        lastReason: cleanReason
      };
    } else {
      state.overrides[trailId] = {
        ...(state.overrides[trailId] || {}),
        publicationStatus: status,
        lastReason: cleanReason,
        lastChangedAt: now
      };
    }
    state.audit.push({ trailId, action: status === "retired" ? "retire" : "publish", reason: cleanReason, changedAt: now });
    return state;
  }

  function filterCatalog(catalog, options = {}) {
    const query = `${options.query || ""}`.trim().toLocaleLowerCase("it-IT");
    return (Array.isArray(catalog) ? catalog : [])
      .filter((item) => options.status === "all" || !options.status || item.publicationStatus === options.status)
      .filter((item) => options.entity === "all" || !options.entity || item.entityCode === options.entity)
      .filter((item) => options.source === "all" || !options.source || item.source === options.source)
      .filter((item) => !query || [item.code, item.name].some((value) => `${value || ""}`.toLocaleLowerCase("it-IT").includes(query)))
      .sort((first, second) => statusOrder(first.publicationStatus) - statusOrder(second.publicationStatus)
        || `${first.code || "ZZZ"}`.localeCompare(`${second.code || "ZZZ"}`, "it", { numeric: true })
        || first.name.localeCompare(second.name, "it"));
  }

  function statusOrder(status) {
    return { published: 0, draft: 1, retired: 2 }[status] ?? 3;
  }

  function catalogStats(catalog) {
    return (Array.isArray(catalog) ? catalog : []).reduce((stats, item) => {
      if (item.publicationStatus === "published") stats.published += 1;
      if (item.publicationStatus === "draft") stats.draft += 1;
      if (item.publicationStatus === "retired") stats.retired += 1;
      if (item.custom) stats.custom += 1;
      return stats;
    }, { published: 0, draft: 0, retired: 0, custom: 0 });
  }

  return {
    SCHEMA,
    catalogStats,
    effectiveCatalog,
    emptyState,
    filterCatalog,
    normalizeBaseTrail,
    normalizeState,
    saveManualTrail,
    setPublicationStatus,
    validateFields
  };
});
