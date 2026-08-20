(function exposeSentieriSupabase(root) {
  "use strict";

  const configuration = root.SentieriSupabaseConfiguration;
  const STORAGE_KEY = "sentieri/supabase-session/v1";

  function configured() {
    return Boolean(configuration?.url && configuration?.publishableKey);
  }

  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }

  function saveSession(session) {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
    root.dispatchEvent(new CustomEvent("sentieri:supabase-session-changed", { detail: session }));
  }

  function decodeUser(accessToken) {
    try {
      const payload = accessToken.split(".")[1].replaceAll("-", "+").replaceAll("_", "/");
      return JSON.parse(decodeURIComponent(escape(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, "=")))));
    } catch {
      return null;
    }
  }

  function captureRedirectSession() {
    const parameters = new URLSearchParams(location.hash.replace(/^#/, ""));
    const accessToken = parameters.get("access_token");
    const refreshToken = parameters.get("refresh_token");
    if (!accessToken || !refreshToken) return loadSession();
    const session = {
      accessToken,
      refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + Number(parameters.get("expires_in") || 3600),
      user: decodeUser(accessToken)
    };
    saveSession(session);
    history.replaceState(null, "", `${location.pathname}${location.search}`);
    return session;
  }

  async function rawRequest(path, { method = "GET", body = null, accessToken = null, headers = {} } = {}) {
    if (!configured()) throw new Error("Supabase non configurato");
    const response = await fetch(`${configuration.url.replace(/\/$/, "")}${path}`, {
      method,
      headers: {
        apikey: configuration.publishableKey,
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers
      },
      ...(body === null ? {} : { body: JSON.stringify(body) })
    });
    const text = await response.text();
    let value;
    try { value = text ? JSON.parse(text) : null; } catch { value = text; }
    if (!response.ok) throw new Error(value?.message || value?.msg || String(value || `Errore HTTP ${response.status}`));
    return value;
  }

  async function validSession() {
    let session = loadSession();
    if (!session?.accessToken) return null;
    if (session.expiresAt > Math.floor(Date.now() / 1000) + 60) return session;
    try {
      const refreshed = await rawRequest("/auth/v1/token?grant_type=refresh_token", {
        method: "POST",
        body: { refresh_token: session.refreshToken }
      });
      session = {
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token,
        expiresAt: Math.floor(Date.now() / 1000) + Number(refreshed.expires_in || 3600),
        user: refreshed.user || decodeUser(refreshed.access_token)
      };
      saveSession(session);
      return session;
    } catch {
      saveSession(null);
      return null;
    }
  }

  async function authenticatedRequest(path, options = {}) {
    const session = await validSession();
    if (!session) throw new Error("Accedi come gestore per usare i dati online");
    return rawRequest(path, { ...options, accessToken: session.accessToken });
  }

  function encodedObjectPath(path) {
    return String(path || "").split("/").map(encodeURIComponent).join("/");
  }

  async function storageRequest(path, { method = "GET", body = null, contentType = null } = {}) {
    const session = await validSession();
    if (!session) throw new Error("Accedi come gestore per usare i dati online");
    const response = await fetch(`${configuration.url.replace(/\/$/, "")}${path}`, {
      method,
      headers: {
        apikey: configuration.publishableKey,
        Authorization: `Bearer ${session.accessToken}`,
        ...(contentType ? { "Content-Type": contentType } : {})
      },
      ...(body === null ? {} : { body })
    });
    const text = await response.text();
    let value;
    try { value = text ? JSON.parse(text) : null; } catch { value = text; }
    if (!response.ok) throw new Error(value?.message || value?.error || String(value || `Errore HTTP ${response.status}`));
    return value;
  }

  async function sendMagicLink(email) {
    const redirectTo = `${location.origin}${location.pathname}`;
    await rawRequest("/auth/v1/otp", {
      method: "POST",
      body: { email, options: { emailRedirectTo: redirectTo } }
    });
  }

  async function currentAccess() {
    return authenticatedRequest("/rest/v1/rpc/manager_current_access", { method: "POST", body: {} });
  }

  async function availability(productId, from, to) {
    return authenticatedRequest("/rest/v1/rpc/product_availability", {
      method: "POST",
      body: { p_product_id: productId, p_from: from, p_to: to }
    });
  }

  async function calendarOverview(entityCode, from, to) {
    return authenticatedRequest("/rest/v1/rpc/manager_calendar_overview", {
      method: "POST",
      body: { p_entity_code: entityCode || null, p_from: from, p_to: to }
    });
  }

  async function calendarDayProducts(entityCode, day) {
    return authenticatedRequest("/rest/v1/rpc/manager_calendar_day_products", {
      method: "POST",
      body: { p_entity_code: entityCode || null, p_day: day }
    });
  }

  async function productBookings(productId, from, to) {
    return authenticatedRequest("/rest/v1/rpc/manager_product_bookings", {
      method: "POST",
      body: { p_product_id: productId, p_from: from, p_to: to }
    });
  }

  async function setCapacityDay(productId, day, accessType, capacity, note = "") {
    return authenticatedRequest("/rest/v1/rpc/set_capacity_day", {
      method: "POST",
      body: {
        p_product_id: productId,
        p_day: day,
        p_access_type: accessType,
        p_capacity: capacity,
        p_note: note
      }
    });
  }

  async function products(entityCode = "") {
    const query = new URLSearchParams({
      select: "id,entity_code,product_type,code,name,status,official,validation_status,source_label,metadata",
      order: "entity_code.asc,code.asc"
    });
    if (entityCode) query.set("entity_code", `eq.${entityCode}`);
    return authenticatedRequest(`/rest/v1/territorial_products?${query}`);
  }

  async function saveProduct(fields) {
    return authenticatedRequest("/rest/v1/rpc/manager_save_product", {
      method: "POST",
      body: {
        p_entity_code: fields.entityCode,
        p_product_id: fields.productId || null,
        p_code: fields.code || "",
        p_name: fields.name,
        p_status: fields.status,
        p_validation_status: fields.validationStatus,
        p_source_label: fields.sourceLabel || null,
        p_metadata: fields.metadata || {},
        p_reason: fields.reason
      }
    });
  }

  async function uploadTrailSource(objectPath, file) {
    const allowedTypes = new Set([
      "application/gpx+xml", "application/geo+json", "application/json",
      "application/xml", "text/xml", "application/octet-stream"
    ]);
    return storageRequest(`/storage/v1/object/trail-source-files/${encodedObjectPath(objectPath)}`, {
      method: "POST",
      body: file,
      contentType: allowedTypes.has(file.type) ? file.type : "application/octet-stream"
    });
  }

  async function deleteTrailSource(objectPath) {
    return storageRequest(`/storage/v1/object/trail-source-files/${encodedObjectPath(objectPath)}`, { method: "DELETE" });
  }

  async function createTrailWithGeometry(fields) {
    return authenticatedRequest("/rest/v1/rpc/manager_create_trail_with_geometry", {
      method: "POST",
      body: {
        p_entity_code: fields.entityCode,
        p_product_id: fields.productId,
        p_code: fields.code || "",
        p_name: fields.name,
        p_difficulty: fields.difficulty || null,
        p_duration_minutes: fields.durationMinutes,
        p_modes: fields.modes || {},
        p_source_label: fields.sourceLabel,
        p_source_url: fields.sourceUrl || null,
        p_source_license: fields.sourceLicense,
        p_acquired_on: fields.acquiredOn,
        p_original_object_path: fields.originalObjectPath,
        p_original_file_name: fields.originalFileName,
        p_original_mime_type: fields.originalMimeType || null,
        p_original_sha256: fields.originalSha256,
        p_geometry: fields.geometry,
        p_reason: fields.reason
      }
    });
  }

  async function trailGeometry(productId) {
    return authenticatedRequest("/rest/v1/rpc/manager_trail_geometry", {
      method: "POST", body: { p_product_id: productId }
    });
  }

  async function validateAndPublishTrail(productId, reason) {
    return authenticatedRequest("/rest/v1/rpc/manager_validate_and_publish_trail", {
      method: "POST", body: { p_product_id: productId, p_reason: reason }
    });
  }

  async function entities() {
    return authenticatedRequest("/rest/v1/managing_entities?select=code,name,active&active=eq.true&order=name.asc");
  }

  async function staffMembers(entityCode) {
    return authenticatedRequest("/rest/v1/rpc/manager_staff_members", {
      method: "POST", body: { p_entity_code: entityCode }
    });
  }

  async function setStaffMember(entityCode, email, role, active, reason = "") {
    return authenticatedRequest("/rest/v1/rpc/manager_set_staff_member", {
      method: "POST",
      body: {
        p_entity_code: entityCode,
        p_email: email,
        p_role: role,
        p_active: active,
        p_reason: reason
      }
    });
  }

  async function superadmins() {
    return authenticatedRequest("/rest/v1/rpc/platform_superadmin_list", { method: "POST", body: {} });
  }

  async function setSuperadmin(email, active, reason) {
    return authenticatedRequest("/rest/v1/rpc/platform_set_superadmin", {
      method: "POST", body: { p_email: email, p_active: active, p_reason: reason }
    });
  }

  async function auditEvents(entityCode = null, limit = 100) {
    return authenticatedRequest("/rest/v1/rpc/manager_admin_audit", {
      method: "POST", body: { p_entity_code: entityCode, p_limit: limit }
    });
  }

  async function titleChecks(entityCode = "PNALM", from, to) {
    return authenticatedRequest("/rest/v1/rpc/manager_entry_title_checks", {
      method: "POST", body: { p_entity_code: entityCode, p_from: from, p_to: to }
    });
  }

  async function fieldOperators(entityCode = "PNALM") {
    return authenticatedRequest("/rest/v1/rpc/manager_field_operators", {
      method: "POST", body: { p_entity_code: entityCode }
    });
  }

  async function setFieldOperator(entityCode, email, role, active = true) {
    return authenticatedRequest("/rest/v1/rpc/manager_set_field_operator", {
      method: "POST",
      body: { p_entity_code: entityCode, p_email: email, p_role: role, p_active: active }
    });
  }

  async function setBookingStatus(entityCode, bookingId, status, reason = "") {
    return authenticatedRequest("/rest/v1/rpc/manager_set_booking_status", {
      method: "POST",
      body: { p_entity_code: entityCode, p_booking_id: bookingId, p_status: status, p_reason: reason }
    });
  }

  captureRedirectSession();
  root.SentieriSupabase = Object.freeze({
    availability,
    auditEvents,
    calendarDayProducts,
    calendarOverview,
    createTrailWithGeometry,
    configured,
    currentAccess,
    deleteTrailSource,
    entities,
    loadSession,
    logout: () => saveSession(null),
    sendMagicLink,
    products,
    productBookings,
    saveProduct,
    setStaffMember,
    setSuperadmin,
    staffMembers,
    superadmins,
    fieldOperators,
    setCapacityDay,
    setBookingStatus,
    setFieldOperator,
    titleChecks,
    trailGeometry,
    uploadTrailSource,
    validateAndPublishTrail,
    validSession
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
