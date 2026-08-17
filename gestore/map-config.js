(function initializeSentieriMapConfiguration(global) {
  "use strict";

  const STORAGE_KEY = "sentieri_map_v1";
  const SCHEMA = "sentieri/tenant-map/v1";
  const DEFAULT_MAP = Object.freeze({
    schema: SCHEMA,
    center: Object.freeze({ name: "Pescasseroli", longitude: 13.789, latitude: 41.803 }),
    detailSideKilometers: 100,
    contextSideKilometers: 100,
    updatedAt: null
  });

  function finiteNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function normalizeMap(input) {
    const source = input && typeof input === "object" ? input : {};
    const detail = Math.max(1, finiteNumber(source.detailSideKilometers, DEFAULT_MAP.detailSideKilometers));
    const context = Math.max(detail, finiteNumber(source.contextSideKilometers, DEFAULT_MAP.contextSideKilometers));
    return {
      schema: SCHEMA,
      center: {
        name: String(source.center?.name || DEFAULT_MAP.center.name).trim().slice(0, 80) || DEFAULT_MAP.center.name,
        longitude: Math.max(-180, Math.min(180, finiteNumber(source.center?.longitude, DEFAULT_MAP.center.longitude))),
        latitude: Math.max(-85, Math.min(85, finiteNumber(source.center?.latitude, DEFAULT_MAP.center.latitude)))
      },
      detailSideKilometers: detail,
      contextSideKilometers: context,
      updatedAt: source.updatedAt || null
    };
  }

  function load() {
    try {
      const stored = global.localStorage?.getItem(STORAGE_KEY);
      return normalizeMap(stored ? JSON.parse(stored) : DEFAULT_MAP);
    } catch {
      return normalizeMap(DEFAULT_MAP);
    }
  }

  function save(input) {
    const normalized = normalizeMap({ ...input, updatedAt: new Date().toISOString() });
    global.localStorage?.setItem(STORAGE_KEY, JSON.stringify(normalized));
    global.dispatchEvent?.(new CustomEvent("sentieri:map-configuration-changed", { detail: normalized }));
    return normalized;
  }

  function reset() {
    global.localStorage?.removeItem(STORAGE_KEY);
    const defaults = normalizeMap(DEFAULT_MAP);
    global.dispatchEvent?.(new CustomEvent("sentieri:map-configuration-changed", { detail: defaults }));
    return defaults;
  }

  global.SentieriMapConfiguration = { STORAGE_KEY, SCHEMA, DEFAULT_MAP, normalizeMap, load, save, reset };
})(window);
