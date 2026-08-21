(function setupManagerTrailCatalog() {
  "use strict";

  const model = window.SentieriManagerCatalogModel;
  const geometryModel = window.SentieriManagerTrailGeometryModel;
  const onlineApi = window.SentieriSupabase;
  const tableBody = document.getElementById("manager-trail-table-body");
  if (!model || !tableBody) return;

  const STORAGE_KEY = "sentieri.manager-catalog-demo.v1";
  const DIFFICULTY_LABELS = {
    "not-specified": "Non indicata",
    easy: "Facile",
    medium: "Medio",
    hard: "Difficile",
    expert: "Esperto"
  };
  const STATUS_LABELS = { published: "Pubblicato", draft: "Bozza", retired: "Ritirato" };
  const ENTITY_LABELS = {
    PNALM: "PNALM",
    PNMAIELLA: "Parco Nazionale della Maiella",
    PRSIRENTEVELINO: "Parco Sirente Velino",
    PNGRANSASSOLAGA: "Parco Gran Sasso e Laga",
    ABRUZZO_CENTRALE: "Abruzzo centrale · fonti candidate",
    REGIONE_ABRUZZO: "Regione Abruzzo"
  };
  const VALIDATION_LABELS = {
    not_reviewed: "Da verificare", "not-reviewed": "Da verificare", in_review: "In verifica",
    validated: "Validato", rejected: "Respinto", needs_revalidation: "Da riverificare"
  };

  const search = document.getElementById("manager-trail-search");
  const statusFilter = document.getElementById("manager-trail-status-filter");
  const entityFilter = document.getElementById("manager-trail-entity-filter");

  const areaFilter = document.getElementById("manager-trail-area-filter");
  const visibleCount = document.getElementById("manager-trail-visible-count");
  const emptyState = document.getElementById("manager-trail-empty-state");
  const catalogMessage = document.getElementById("manager-trail-message");
  const publishedCount = document.getElementById("trail-published-count");
  const draftCount = document.getElementById("trail-draft-count");
  const retiredCount = document.getElementById("trail-retired-count");
  const customCount = document.getElementById("trail-custom-count");
  const addButton = document.getElementById("add-manager-trail");

  const trailListView = document.getElementById("manager-trail-list-view");
  const trailDetail = document.getElementById("manager-trail-detail");
  const trailDetailCode = document.getElementById("manager-trail-detail-code");
  const trailDetailTitle = document.getElementById("manager-trail-detail-title");
  const trailDetailMeta = document.getElementById("manager-trail-detail-meta");
  const closeTrailDetail = document.getElementById("close-manager-trail-detail");
  const editTrailDetail = document.getElementById("edit-manager-trail-detail");
  const trailDataEntity = document.getElementById("trail-data-entity");
  const trailDataPublication = document.getElementById("trail-data-publication");
  const trailDataValidation = document.getElementById("trail-data-validation");
  const trailDataGeometry = document.getElementById("trail-data-geometry");
  const trailDataAuthority = document.getElementById("trail-data-authority");
  const trailDataAcquired = document.getElementById("trail-data-acquired");
  const trailDataPrimarySource = document.getElementById("trail-data-primary-source");
  const trailDataSourceLink = document.getElementById("trail-data-source-link");
  const trailDataLicense = document.getElementById("trail-data-license");
  const trailDataFile = document.getElementById("trail-data-file");
  const trailDataCaiRow = document.getElementById("trail-data-cai-row");
  const trailDataCai = document.getElementById("trail-data-cai");
  const trailDataSources = document.getElementById("trail-data-sources");

  const editor = document.getElementById("trail-editor-dialog");
  const editorForm = document.getElementById("trail-editor-form");
  const editorId = document.getElementById("trail-editor-id");
  const editorKicker = document.getElementById("trail-editor-kicker");
  const editorTitle = document.getElementById("trail-editor-title");
  const editorCode = document.getElementById("trail-editor-code");
  const editorEntityField = document.getElementById("trail-editor-entity-field");
  const editorEntity = document.getElementById("trail-editor-entity");
  const editorName = document.getElementById("trail-editor-name");
  const editorDifficulty = document.getElementById("trail-editor-difficulty");
  const editorDuration = document.getElementById("trail-editor-duration");
  const editorLength = document.getElementById("trail-editor-length");
  const editorGain = document.getElementById("trail-editor-gain");
  const editorLoss = document.getElementById("trail-editor-loss");
  const editorWalking = document.getElementById("trail-editor-walking");
  const editorBike = document.getElementById("trail-editor-bike");
  const editorEBike = document.getElementById("trail-editor-ebike");
  const editorHorse = document.getElementById("trail-editor-horse");
  const editorSource = document.getElementById("trail-editor-source");
  const editorSourceReadonly = document.getElementById("trail-editor-source-readonly");
  const editorProvenance = document.getElementById("trail-editor-provenance");
  const editorSourceLabel = document.getElementById("trail-editor-source-label");
  const editorSourceUrl = document.getElementById("trail-editor-source-url");
  const editorLicense = document.getElementById("trail-editor-license");
  const editorAcquiredOn = document.getElementById("trail-editor-acquired-on");
  const editorGeometry = document.getElementById("trail-editor-geometry");
  const editorFile = document.getElementById("trail-editor-file");
  const editorMap = document.getElementById("trail-editor-map");
  const editorMapEmpty = document.getElementById("trail-editor-map-empty");
  const geometryMetrics = document.getElementById("trail-geometry-metrics");
  const geometryLength = document.getElementById("trail-geometry-length");
  const geometryPoints = document.getElementById("trail-geometry-points");
  const geometrySegments = document.getElementById("trail-geometry-segments");
  const geometryFileName = document.getElementById("trail-geometry-file-name");
  const geometryEdit = document.getElementById("trail-geometry-edit");
  const geometryReverse = document.getElementById("trail-geometry-reverse");
  const geometryReset = document.getElementById("trail-geometry-reset");
  const editorReasonLabel = document.getElementById("trail-editor-reason-label");
  const editorReason = document.getElementById("trail-editor-reason");
  const editorGeometryNote = document.getElementById("trail-editor-geometry-note");
  const editorMessage = document.getElementById("trail-editor-message");
  const closeEditor = document.getElementById("close-trail-editor");
  const cancelEditor = document.getElementById("cancel-trail-editor");

  const statusDialog = document.getElementById("trail-status-dialog");
  const statusForm = document.getElementById("trail-status-form");
  const statusTitle = document.getElementById("trail-status-title");
  const statusDescription = document.getElementById("trail-status-description");
  const statusId = document.getElementById("trail-status-id");
  const statusValue = document.getElementById("trail-status-value");
  const statusReason = document.getElementById("trail-status-reason");
  const statusMessage = document.getElementById("trail-status-message");
  const statusConfirm = document.getElementById("confirm-trail-status");
  const cancelStatus = document.getElementById("cancel-trail-status");

  let baseTrails = [];
  let catalogState = loadState();
  let effectiveTrails = [];
  let onlineMode = false;
  let managerAccess = [];
  let availableEntities = [];
  let trailMap = null;
  let trailMapLoaded = false;
  let currentGeometry = null;
  let importedGeometry = null;
  let currentFile = null;
  let vertexMarkers = [];
  let editingVertices = false;
  let detailedTrail = null;
  let pendingTrailOpen = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function loadState() {
    try {
      return model.normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
    } catch {
      return model.emptyState();
    }
  }

  function saveState() {
    if (onlineMode) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogState));
  }

  function remoteTrail(row) {
    const metadata = row.metadata || {};
    const modes = metadata.modes || {};
    return {
      id: row.id,
      entityCode: row.entity_code || "PNALM",
      code: row.code || "",
      name: row.name,
      difficulty: ({ Facile: "easy", Medio: "medium", Difficile: "hard", Esperto: "expert" })[metadata.difficulty] || "not-specified",
      durationMinutes: Number.isFinite(Number(metadata.duration_minutes)) ? Number(metadata.duration_minutes) : null,
      lengthMeters: Number.isFinite(Number(metadata.length_meters)) ? Number(metadata.length_meters) : null,
      elevationGainMeters: Number.isFinite(Number(metadata.elevation_gain_meters)) ? Number(metadata.elevation_gain_meters) : null,
      elevationLossMeters: Number.isFinite(Number(metadata.elevation_loss_meters)) ? Number(metadata.elevation_loss_meters) : null,
      walking: modes.walking !== false,
      mountainBike: Boolean(modes.bike),
      eBike: Boolean(modes.ebike),
      horse: Boolean(modes.horse),
      source: row.source_label || "Fonte non indicata",
      official: Boolean(row.official),
      geometryAvailable: metadata.geometry_available !== false,
      custom: row.source_label === "Inserimento manuale gestore",
      publicationStatus: row.status === "active" ? "published" : row.status === "draft" ? "draft" : "retired",
      remoteValidationStatus: row.validation_status || "not_reviewed",
      lastReason: metadata.last_manager_note || null,
      areas: Array.isArray(metadata.territory_area_names) ? metadata.territory_area_names.filter(Boolean) : [],
      remoteMetadata: metadata
    };
  }

  async function loadRemoteCatalog() {
    const session = await onlineApi?.validSession();
    if (!session) return false;
    onlineMode = true;

    catalogState = model.emptyState();
    baseTrails = [];
    renderCatalog();
    try {
      const rows = await onlineApi.products();
      baseTrails = rows.map(remoteTrail);
      renderCatalog();
      catalogMessage.classList.remove("admin-message--error");
      catalogMessage.textContent = `Catalogo collegato a Supabase: ${rows.length.toLocaleString("it-IT")} percorsi in tutti gli ambiti gestiti.`;
      return true;
    } catch (error) {
      catalogMessage.textContent = error.message || "Catalogo online non raggiungibile.";
      catalogMessage.classList.add("admin-message--error");
      return false;
    }
  }

  function formatDuration(minutes) {
    if (!Number.isFinite(minutes)) return "Durata —";
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return hours ? `${hours} h${remaining ? ` ${remaining} min` : ""}` : `${remaining} min`;
  }

  function formatLength(meters) {
    return Number.isFinite(meters) ? `${(meters / 1000).toLocaleString("it-IT", { maximumFractionDigits: 1 })} km` : "Lunghezza —";
  }

  function modesFor(item) {
    const modes = [];
    if (item.walking) modes.push("A piedi");
    if (item.mountainBike) modes.push("Bici");
    if (item.eBike) modes.push("E-bike");
    if (item.horse) modes.push("Cavallo");
    return modes.length ? modes : ["Non indicate"];
  }


  function populateAreaFilter() {
    const selected = areaFilter.value || "all";
    const areas = [...new Set(effectiveTrails.flatMap((item) => item.areas || []))]
      .sort((a, b) => a.localeCompare(b, "it"));
    areaFilter.innerHTML = '<option value="all">Tutte le aree</option>'
      + areas.map((area) => `<option value="${escapeHtml(area)}">${escapeHtml(area)}</option>`).join("");
    areaFilter.value = areas.includes(selected) ? selected : "all";
  }

  function populateEntityFilter() {
    const selected = entityFilter.value || "all";
    const entities = [...new Set(effectiveTrails.map((item) => item.entityCode).filter(Boolean))]
      .sort((a, b) => (ENTITY_LABELS[a] || a).localeCompare(ENTITY_LABELS[b] || b, "it"));
    entityFilter.innerHTML = '<option value="all">Tutti gli enti gestiti</option>'
      + entities.map((entity) => `<option value="${escapeHtml(entity)}">${escapeHtml(ENTITY_LABELS[entity] || entity)}</option>`).join("");
    entityFilter.value = entities.includes(selected) ? selected : "all";
  }

  function canAdministerTrail(item) {
    return managerAccess.some((access) => access.staff_role === "superadmin"
      || (access.entity_code === item.entityCode && access.staff_role === "admin"));
  }

  function renderCatalog() {
    effectiveTrails = model.effectiveCatalog(baseTrails, catalogState);
    const stats = model.catalogStats(effectiveTrails);
    publishedCount.textContent = stats.published.toLocaleString("it-IT");
    draftCount.textContent = stats.draft.toLocaleString("it-IT");
    retiredCount.textContent = stats.retired.toLocaleString("it-IT");
    customCount.textContent = stats.custom.toLocaleString("it-IT");

    populateAreaFilter();
    populateEntityFilter();
    let filtered = model.filterCatalog(effectiveTrails, {
      query: search.value,
      status: statusFilter.value,
      entity: entityFilter.value,
      source: "all"
    });
    if (areaFilter.value !== "all") {
      filtered = filtered.filter((item) => (item.areas || []).includes(areaFilter.value));
    }
    visibleCount.textContent = `${filtered.length.toLocaleString("it-IT")} su ${effectiveTrails.length.toLocaleString("it-IT")}`;
    emptyState.hidden = filtered.length > 0;
    tableBody.innerHTML = filtered.map((item) => {
      const statusAction = item.publicationStatus === "published"
        ? `<button type="button" class="outline trail-row-action trail-row-action--danger" data-action="retire" data-id="${escapeHtml(item.id)}" aria-label="Ritira dall’app" title="Ritira dall’app">⊘</button>`
        : item.publicationStatus === "draft" && item.geometryAvailable && canAdministerTrail(item)
          ? `<button type="button" class="outline trail-row-action" data-action="validate-publish" data-id="${escapeHtml(item.id)}" aria-label="Valida e pubblica" title="Valida e pubblica">↑</button>`
          : item.publicationStatus === "retired" && item.geometryAvailable && item.remoteValidationStatus === "validated"
            ? `<button type="button" class="outline trail-row-action" data-action="publish" data-id="${escapeHtml(item.id)}" aria-label="Ripubblica" title="Ripubblica">↑</button>`
            : item.publicationStatus === "retired" && item.geometryAvailable && canAdministerTrail(item)
              ? `<button type="button" class="outline trail-row-action" data-action="validate-publish" data-id="${escapeHtml(item.id)}" aria-label="Valida e pubblica" title="Valida e pubblica">↑</button>`
              : "";
      const modes = modesFor(item);
      return `
        <tr class="trail-row trail-row--${escapeHtml(item.publicationStatus)}">
          <td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.code || "Senza codice")}</small></td>
          <td><strong>${escapeHtml(DIFFICULTY_LABELS[item.difficulty] || "Non indicata")}</strong><small>${escapeHtml(formatLength(item.lengthMeters))} · ${escapeHtml(formatDuration(item.durationMinutes))}</small><span class="trail-mode-tags">${modes.map((mode) => `<i>${escapeHtml(mode)}</i>`).join("")}</span></td>
          <td><span class="trail-publication-status trail-publication-status--${escapeHtml(item.publicationStatus)}">${escapeHtml(STATUS_LABELS[item.publicationStatus])}</span></td>
          <td><strong>${escapeHtml(ENTITY_LABELS[item.entityCode] || item.entityCode || "Non indicato")}</strong></td>
          <td><div class="trail-row-actions"><button type="button" class="outline trail-row-action" data-action="bookings" data-id="${escapeHtml(item.id)}" aria-label="Prenotazioni" title="Prenotazioni">▣</button><button type="button" class="outline trail-row-action" data-action="details" data-id="${escapeHtml(item.id)}" aria-label="Dettagli" title="Dettagli">ⓘ</button><button type="button" class="outline trail-row-action" data-action="edit" data-id="${escapeHtml(item.id)}" aria-label="Modifica" title="Modifica">✎</button>${statusAction}</div></td>
        </tr>`;
    }).join("");
    window.dispatchEvent(new CustomEvent("sentieri:manager-catalog-updated", { detail: { catalog: effectiveTrails } }));
    if (pendingTrailOpen) openTrailFromRequest(pendingTrailOpen);
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function setNumberInput(input, value, divisor = 1) {
    input.value = Number.isFinite(value) ? value / divisor : "";
  }

  async function loadAvailableEntities(access = managerAccess) {
    managerAccess = access || [];
    const allEntities = await onlineApi.entities();
    const superadmin = managerAccess.some((item) => item.staff_role === "superadmin");
    const allowed = new Set(managerAccess.map((item) => item.entity_code).filter(Boolean));
    availableEntities = superadmin ? allEntities : allEntities.filter((item) => allowed.has(item.code));
    editorEntity.innerHTML = availableEntities
      .map((item) => `<option value="${escapeHtml(item.code)}">${escapeHtml(item.name)}</option>`)
      .join("");
  }

  function initializeTrailMap() {
    if (trailMap || !window.maplibregl) return;
    trailMap = new window.maplibregl.Map({
      container: editorMap,
      center: [13.789, 41.803],
      zoom: 7,
      attributionControl: true,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors"
          }
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }]
      }
    });
    trailMap.addControl(new window.maplibregl.NavigationControl({ showCompass: false }), "top-right");
    trailMap.on("load", () => {
      trailMapLoaded = true;
      trailMap.addSource("manager-trail", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "MultiLineString", coordinates: [] } }
      });
      trailMap.addLayer({
        id: "manager-trail-line",
        type: "line",
        source: "manager-trail",
        paint: { "line-color": "#e46a44", "line-width": 5, "line-opacity": 0.92 },
        layout: { "line-cap": "round", "line-join": "round" }
      });
      renderGeometry(true);
    });
  }

  function clearVertexMarkers() {
    vertexMarkers.forEach((marker) => marker.remove());
    vertexMarkers = [];
  }

  function refreshVertexMarkers() {
    clearVertexMarkers();
    if (!editingVertices || !trailMapLoaded || !currentGeometry) return;
    currentGeometry.coordinates.forEach((segment, segmentIndex) => {
      segment.forEach((coordinate, pointIndex) => {
        const element = document.createElement("span");
        element.className = "trail-vertex-marker";
        const marker = new window.maplibregl.Marker({ element, draggable: true })
          .setLngLat(coordinate)
          .addTo(trailMap);
        marker.on("drag", () => {
          const point = marker.getLngLat();
          currentGeometry = geometryModel.setCoordinate(currentGeometry, segmentIndex, pointIndex, point.lng, point.lat);
          const source = trailMap.getSource("manager-trail");
          source?.setData({ type: "Feature", properties: {}, geometry: currentGeometry });
          updateGeometryMetrics();
        });
        vertexMarkers.push(marker);
      });
    });
  }

  function updateGeometryMetrics() {
    if (!currentGeometry) {
      geometryMetrics.hidden = true;
      return;
    }
    const result = geometryModel.metrics(currentGeometry);
    geometryMetrics.hidden = false;
    geometryLength.textContent = `${(result.lengthMeters / 1000).toLocaleString("it-IT", { maximumFractionDigits: 2 })} km`;
    geometryPoints.textContent = result.pointCount.toLocaleString("it-IT");
    geometrySegments.textContent = result.segmentCount.toLocaleString("it-IT");
    geometryFileName.textContent = currentFile?.name || "—";
  }

  function renderGeometry(fit = false) {
    const hasGeometry = Boolean(currentGeometry);
    editorMapEmpty.hidden = hasGeometry;
    geometryEdit.disabled = !hasGeometry;
    geometryReverse.disabled = !hasGeometry;
    geometryReset.disabled = !hasGeometry;
    updateGeometryMetrics();
    if (!trailMapLoaded) return;
    const source = trailMap.getSource("manager-trail");
    source?.setData({
      type: "Feature",
      properties: {},
      geometry: currentGeometry || { type: "MultiLineString", coordinates: [] }
    });
    if (fit && currentGeometry) {
      const bbox = geometryModel.metrics(currentGeometry).bbox;
      trailMap.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { padding: 48, maxZoom: 15, duration: 0 });
    }
    refreshVertexMarkers();
  }

  function resetGeometryEditor() {
    currentGeometry = null;
    importedGeometry = null;
    currentFile = null;
    editingVertices = false;
    editorGeometry.classList.remove("trail-geometry-editor--editing");
    geometryEdit.textContent = "Modifica punti";
    clearVertexMarkers();
    renderGeometry();
  }

  async function readTrailFile(file) {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) throw new Error("FILE_TOO_LARGE");
    const parsed = geometryModel.parseFileText(await file.text(), file.name);
    importedGeometry = geometryModel.simplifyForEditing(parsed, 600);
    currentGeometry = JSON.parse(JSON.stringify(importedGeometry));
    currentFile = file;
    const result = geometryModel.metrics(currentGeometry);
    editorLength.value = (result.lengthMeters / 1000).toFixed(2);
    if (result.hasElevation) {
      editorGain.value = result.elevationGainMeters;
      editorLoss.value = result.elevationLossMeters;
    }
    renderGeometry(true);
  }

  function safeFileName(name) {
    const cleaned = String(name || "traccia").normalize("NFKD")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return cleaned.slice(0, 120) || "traccia";
  }

  async function sha256(file) {
    const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function openTrailEditor(item = null) {
    editorForm.reset();
    resetGeometryEditor();
    editorMessage.textContent = "";
    editorId.value = item?.id || "";
    editorKicker.textContent = item ? "Correzione manuale" : "Nuovo percorso";
    editorTitle.textContent = item ? `${item.code ? `${item.code} · ` : ""}${item.name}` : "Aggiungi percorso";
    editorCode.value = item?.code || "";
    editorName.value = item?.name || "";
    editorDifficulty.value = item?.difficulty || "not-specified";
    setNumberInput(editorDuration, item?.durationMinutes);
    setNumberInput(editorLength, item?.lengthMeters, 1000);
    setNumberInput(editorGain, item?.elevationGainMeters);
    setNumberInput(editorLoss, item?.elevationLossMeters);
    editorWalking.checked = item ? item.walking : true;
    editorBike.checked = Boolean(item?.mountainBike);
    editorEBike.checked = Boolean(item?.eBike);
    editorHorse.checked = Boolean(item?.horse);
    if (item?.entityCode && ![...editorEntity.options].some((option) => option.value === item.entityCode)) {
      editorEntity.add(new Option(item.entityCode, item.entityCode));
    }
    editorEntity.value = item?.entityCode || availableEntities[0]?.code || "";
    editorEntity.disabled = Boolean(item);
    editorEntityField.hidden = false;
    editorSource.textContent = item?.source || "Inserimento manuale gestore";
    editorSourceReadonly.hidden = !item;
    editorProvenance.hidden = Boolean(item);
    editorGeometry.hidden = Boolean(item);
    [editorSourceLabel, editorLicense, editorAcquiredOn].forEach((input) => { input.disabled = Boolean(item); });
    editorSourceUrl.disabled = Boolean(item);
    editorSourceLabel.value = "";
    editorSourceUrl.value = "";
    editorLicense.value = "";
    editorAcquiredOn.value = new Date().toISOString().slice(0, 10);
    editorAcquiredOn.max = new Date().toISOString().slice(0, 10);
    editorReasonLabel.textContent = item ? "Motivo della correzione" : "Nota iniziale";
    editorReason.placeholder = item ? "Perché questi dati vengono corretti" : "Perché viene creato questo percorso";
    editorGeometryNote.hidden = !item;
    editorGeometryNote.innerHTML = item?.geometryAvailable
      ? "La scheda viene corretta senza riscrivere il tracciato originale."
      : "Questo percorso non ha ancora un tracciato collegato.";
    openDialog(editor);
    if (!item) {
      initializeTrailMap();
      window.setTimeout(() => trailMap?.resize(), 0);
    }
    editorName.focus();
  }

  function showTrailList() {
    detailedTrail = null;
    trailDetail.hidden = true;
    trailListView.hidden = false;
  }

  function safeHttpUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
    } catch {
      return null;
    }
  }

  function formatAcquiredDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(String(value || ""))) return "Non registrato";
    return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short", year: "numeric" })
      .format(new Date(`${String(value).slice(0, 10)}T12:00:00`));
  }

  function renderTrailData(item) {
    const metadata = item.remoteMetadata || {};
    const sources = [...new Set((Array.isArray(metadata.source_names) ? metadata.source_names : [item.source])
      .map((value) => String(value || "").trim()).filter(Boolean))];
    trailDataEntity.textContent = item.entityCode || "Non indicato";
    trailDataPublication.textContent = STATUS_LABELS[item.publicationStatus] || item.publicationStatus || "Non indicata";
    trailDataValidation.textContent = VALIDATION_LABELS[item.remoteValidationStatus] || item.remoteValidationStatus || "Da verificare";
    trailDataGeometry.textContent = item.geometryAvailable ? `Disponibile${metadata.geometry_version ? ` · versione ${metadata.geometry_version}` : ""}` : "Assente";
    trailDataAuthority.textContent = metadata.canonical_parent_authority_reason
      || (item.official ? "Fonte ufficiale dell’ente" : "Fonte esterna o candidata");
    trailDataAcquired.textContent = formatAcquiredDate(metadata.source_acquired_on || metadata.acquired_on);
    trailDataPrimarySource.textContent = item.source || "Non indicata";
    trailDataLicense.textContent = metadata.source_license || "Non indicata";
    trailDataFile.textContent = metadata.source_file_name || "Non disponibile";
    trailDataSources.innerHTML = sources.length
      ? sources.map((source) => `<span>${escapeHtml(source)}</span>`).join("")
      : '<span>Non indicate</span>';

    const sourceUrl = safeHttpUrl(metadata.source_url);
    trailDataSourceLink.hidden = !sourceUrl;
    if (sourceUrl) trailDataSourceLink.href = sourceUrl;
    else trailDataSourceLink.removeAttribute("href");

    const caiParts = [metadata.cai_code, metadata.cai_name, metadata.cai_section].filter(Boolean);
    trailDataCaiRow.hidden = caiParts.length === 0;
    trailDataCai.textContent = caiParts.join(" · ") || "—";
  }

  function openTrailDetail(item, date = null) {
    if (!item) return;
    detailedTrail = item;
    trailDetailCode.textContent = item.code || "Senza codice";
    trailDetailTitle.textContent = item.name;
    trailDetailMeta.textContent = `${item.entityCode || "Ente non indicato"} · ${STATUS_LABELS[item.publicationStatus] || item.publicationStatus}`;
    renderTrailData(item);
    trailListView.hidden = true;
    trailDetail.hidden = false;
    window.dispatchEvent(new CustomEvent("sentieri:manager-trail-detail-opened", {
      detail: { trail: item, date }
    }));
  }

  function openTrailDetailSection(item, selector) {
    openTrailDetail(item);
    requestAnimationFrame(() => trailDetail.querySelector(selector)?.scrollIntoView({ block: "start" }));
  }

  function openTrailFromRequest(request) {
    const item = effectiveTrails.find((trail) => trail.id === request?.productId);
    if (!item) {
      pendingTrailOpen = request || null;
      return;
    }
    pendingTrailOpen = null;
    const trailsTab = document.querySelector('[data-manager-tab="trails"]');
    if (trailsTab && !trailsTab.classList.contains("manager-section-nav__item--active")) trailsTab.click();
    openTrailDetail(item, request?.date || null);
  }

  function readNullableNumber(input, multiplier = 1) {
    if (input.value === "") return null;
    const parsed = Number(input.value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed * multiplier : Number.NaN;
  }

  function editorFields() {
    return {
      code: editorCode.value.trim(),
      name: editorName.value.trim(),
      difficulty: editorDifficulty.value,
      durationMinutes: readNullableNumber(editorDuration),
      lengthMeters: readNullableNumber(editorLength, 1000),
      elevationGainMeters: readNullableNumber(editorGain),
      elevationLossMeters: readNullableNumber(editorLoss),
      walking: editorWalking.checked,
      mountainBike: editorBike.checked,
      eBike: editorEBike.checked,
      horse: editorHorse.checked
    };
  }

  function openStatusDialog(item, nextStatus) {
    statusForm.reset();
    statusMessage.textContent = "";
    statusId.value = item.id;
    statusValue.value = nextStatus;
    const validating = nextStatus === "validate-publish";
    const publishing = nextStatus === "published" || validating;
    statusTitle.textContent = validating ? "Valida e pubblica percorso" : publishing ? "Ripubblica percorso" : "Ritira percorso dall’app";
    statusDescription.textContent = validating
      ? `${item.code ? `${item.code} · ` : ""}${item.name} sarà validato e diventerà visibile ai visitatori.`
      : publishing
      ? `${item.code ? `${item.code} · ` : ""}${item.name} tornerà visibile ai visitatori.`
      : `${item.code ? `${item.code} · ` : ""}${item.name} non sarà più mostrato nell’app. Dati, fonte e storico resteranno conservati.`;
    statusReason.placeholder = validating ? "Esito della verifica" : publishing ? "Perché il percorso torna disponibile" : "Perché il percorso viene ritirato";
    statusConfirm.textContent = validating ? "Valida e pubblica" : publishing ? "Ripubblica" : "Ritira dall’app";
    openDialog(statusDialog);
    statusReason.focus();
  }

  editorForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = editorFields();
    if (!editorForm.reportValidity() || model.validateFields(fields).length) {
      editorMessage.textContent = "Controlla nome e valori numerici.";
      return;
    }
    const existing = effectiveTrails.find((item) => item.id === editorId.value);
    if (!existing && (!currentFile || !currentGeometry)) {
      editorMessage.textContent = "Seleziona un file GPX o GeoJSON valido.";
      return;
    }
    try {
      if (onlineMode) {
        const difficultyLabel = {
          easy: "Facile",
          medium: "Medio",
          hard: "Difficile",
          expert: "Esperto"
        }[fields.difficulty] || null;
        const metadata = {
          ...(existing?.remoteMetadata || {}),
          difficulty: difficultyLabel,
          duration_minutes: fields.durationMinutes,
          length_meters: fields.lengthMeters,
          elevation_gain_meters: fields.elevationGainMeters,
          elevation_loss_meters: fields.elevationLossMeters,
          modes: {
            walking: fields.walking,
            bike: fields.mountainBike,
            ebike: fields.eBike,
            horse: fields.horse
          },
          geometry_available: existing ? existing.geometryAvailable : false,
          last_manager_note: editorReason.value.trim()
        };
        if (existing) {
          await onlineApi.saveProduct({
            entityCode: existing.entityCode,
            productId: existing.id,
            code: fields.code || existing.code,
            name: fields.name,
            status: existing.publicationStatus === "published" ? "active" : existing.publicationStatus === "draft" ? "draft" : "archived",
            validationStatus: existing.remoteValidationStatus,
            sourceLabel: existing.source,
            metadata,
            reason: editorReason.value.trim()
          });
        } else {
          const session = await onlineApi.validSession();
          const productId = `manager-${crypto.randomUUID()}`;
          const userId = session.user.id || session.user.sub;
          const objectPath = `${editorEntity.value}/${userId}/${productId}/${safeFileName(currentFile.name)}`;
          let uploaded = false;
          try {
            await onlineApi.uploadTrailSource(objectPath, currentFile);
            uploaded = true;
            await onlineApi.createTrailWithGeometry({
              entityCode: editorEntity.value,
              productId,
              code: fields.code,
              name: fields.name,
              difficulty: difficultyLabel,
              durationMinutes: fields.durationMinutes,
              modes: metadata.modes,
              sourceLabel: editorSourceLabel.value.trim(),
              sourceUrl: editorSourceUrl.value.trim(),
              sourceLicense: editorLicense.value.trim(),
              acquiredOn: editorAcquiredOn.value,
              originalObjectPath: objectPath,
              originalFileName: currentFile.name,
              originalMimeType: currentFile.type || "application/octet-stream",
              originalSha256: await sha256(currentFile),
              geometry: currentGeometry,
              reason: editorReason.value.trim()
            });
          } catch (error) {
            if (uploaded) {
              try { await onlineApi.deleteTrailSource(objectPath); } catch { /* conserva l'errore principale */ }
            }
            throw error;
          }
        }
        closeDialog(editor);
        await loadRemoteCatalog();
        catalogMessage.classList.remove("admin-message--error");
        catalogMessage.textContent = existing
          ? "Correzione salvata online; la fonte originale è rimasta invariata."
          : "Nuovo percorso salvato in bozza con tracciato e fonte originale.";
        return;
      }
      if (!existing) throw new Error("ONLINE_REQUIRED");
      catalogState = model.saveManualTrail(
        catalogState,
        baseTrails,
        editorId.value || null,
        fields,
        editorReason.value,
        new Date().toISOString(),
        `manager-${Date.now()}`
      );
      saveState();
      closeDialog(editor);
      renderCatalog();
      catalogMessage.textContent = editorId.value
        ? "Correzione salvata localmente; la fonte originale è rimasta invariata."
        : "Nuovo percorso salvato in bozza, in attesa della geometria.";
    } catch (error) {
      const messages = {
        REASON_REQUIRED: "Inserisci una motivazione.",
        ONLINE_REQUIRED: "Il nuovo percorso richiede il collegamento al catalogo online.",
        FILE_TOO_LARGE: "Il file supera il limite di 15 MB.",
        INVALID_GPX: "Il file GPX non è valido.",
        INVALID_GEOJSON: "Il file GeoJSON non è valido.",
        GEOMETRY_REQUIRED: "Nel file non è presente un tracciato lineare valido."
      };
      editorMessage.textContent = messages[error.message] || error.message || "Impossibile salvare: controlla i dati inseriti.";
    }
  });

  statusForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      if (onlineMode) {
        const item = effectiveTrails.find((trail) => trail.id === statusId.value);
        if (!item) throw new Error("TRAIL_NOT_FOUND");
        if (statusValue.value === "validate-publish") {
          await onlineApi.validateAndPublishTrail(item.id, statusReason.value.trim());
        } else {
          await onlineApi.saveProduct({
            entityCode: item.entityCode,
            productId: item.id,
            code: item.code,
            name: item.name,
            status: statusValue.value === "published" ? "active" : "archived",
            validationStatus: item.remoteValidationStatus,
            sourceLabel: item.source,
            metadata: { ...(item.remoteMetadata || {}), last_manager_note: statusReason.value.trim() },
            reason: statusReason.value.trim()
          });
        }
        closeDialog(statusDialog);
        await loadRemoteCatalog();
        catalogMessage.classList.remove("admin-message--error");
        catalogMessage.textContent = statusValue.value === "validate-publish"
          ? "Percorso validato e pubblicato."
          : statusValue.value === "published"
          ? "Percorso ripubblicato online."
          : "Percorso ritirato dall’app; dati e storico sono conservati.";
        return;
      }
      catalogState = model.setPublicationStatus(
        catalogState,
        statusId.value,
        statusValue.value,
        statusReason.value,
        new Date().toISOString()
      );
      saveState();
      closeDialog(statusDialog);
      renderCatalog();
      catalogMessage.textContent = statusValue.value === "published"
        ? "Percorso ripubblicato nella demo."
        : "Percorso ritirato dall’app; dati e storico sono conservati.";
    } catch (error) {
      statusMessage.textContent = error.message === "REASON_REQUIRED" ? "Inserisci una motivazione." : "Operazione non disponibile.";
    }
  });

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action][data-id]");
    if (!button) return;
    const item = effectiveTrails.find((trail) => trail.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.action === "bookings") openTrailDetailSection(item, ".trail-detail-calendar-workspace");
    if (button.dataset.action === "details") openTrailDetailSection(item, ".trail-data-section");
    if (button.dataset.action === "edit") openTrailEditor(item);
    if (button.dataset.action === "retire") openStatusDialog(item, "retired");
    if (button.dataset.action === "publish") openStatusDialog(item, "published");
    if (button.dataset.action === "validate-publish") openStatusDialog(item, "validate-publish");
  });

  addButton.addEventListener("click", () => openTrailEditor());
  closeTrailDetail.addEventListener("click", showTrailList);
  editTrailDetail.addEventListener("click", () => {
    if (detailedTrail) openTrailEditor(detailedTrail);
  });
  closeEditor.addEventListener("click", () => {
    closeDialog(editor);
    clearVertexMarkers();
  });
  cancelEditor.addEventListener("click", () => {
    closeDialog(editor);
    clearVertexMarkers();
  });
  cancelStatus.addEventListener("click", () => closeDialog(statusDialog));
  [search, statusFilter, entityFilter, areaFilter].forEach((control) => control.addEventListener("input", renderCatalog));

  editorFile.addEventListener("change", async () => {
    editorMessage.textContent = "";
    resetGeometryEditor();
    currentFile = editorFile.files[0] || null;
    if (!currentFile) return;
    try {
      await readTrailFile(currentFile);
    } catch (error) {
      resetGeometryEditor();
      editorFile.value = "";
      const messages = {
        FILE_TOO_LARGE: "Il file supera il limite di 15 MB.",
        INVALID_GPX: "Il file GPX non è valido.",
        INVALID_GEOJSON: "Il file GeoJSON non è valido.",
        GEOMETRY_REQUIRED: "Nel file non è presente un tracciato lineare valido."
      };
      editorMessage.textContent = messages[error.message] || "File non leggibile.";
    }
  });

  geometryReverse.addEventListener("click", () => {
    if (!currentGeometry) return;
    currentGeometry = geometryModel.reverse(currentGeometry);
    renderGeometry();
  });

  geometryReset.addEventListener("click", () => {
    if (!importedGeometry) return;
    currentGeometry = JSON.parse(JSON.stringify(importedGeometry));
    renderGeometry(true);
  });

  geometryEdit.addEventListener("click", () => {
    if (!currentGeometry) return;
    editingVertices = !editingVertices;
    editorGeometry.classList.toggle("trail-geometry-editor--editing", editingVertices);
    geometryEdit.textContent = editingVertices ? "Termina modifica" : "Modifica punti";
    refreshVertexMarkers();
  });


  window.addEventListener("sentieri:manager-online", async (event) => {
    try { await loadAvailableEntities(event.detail?.access || []); } catch { availableEntities = []; }
    await loadRemoteCatalog();
  });
  window.addEventListener("sentieri:open-manager-trail", (event) => {
    openTrailFromRequest(event.detail);
  });

  loadRemoteCatalog();
})();
