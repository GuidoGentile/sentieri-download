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

  async function sendMagicLink(email) {
    const redirectTo = `${location.origin}${location.pathname}`;
    await rawRequest("/auth/v1/otp", {
      method: "POST",
      body: { email, options: { emailRedirectTo: redirectTo } }
    });
  }

  async function claimInitialAccess() {
    return authenticatedRequest("/rest/v1/rpc/claim_initial_staff_access", { method: "POST", body: {} });
  }

  async function availability(productId, from, to) {
    return authenticatedRequest("/rest/v1/rpc/product_availability", {
      method: "POST",
      body: { p_product_id: productId, p_from: from, p_to: to }
    });
  }

  async function bookings(entityCode, from, to) {
    return authenticatedRequest("/rest/v1/rpc/manager_bookings", {
      method: "POST",
      body: { p_entity_code: entityCode, p_from: from, p_to: to }
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

  async function updateProduct(productId, fields) {
    return authenticatedRequest(`/rest/v1/territorial_products?id=eq.${encodeURIComponent(productId)}`, {
      method: "PATCH",
      body: fields,
      headers: { Prefer: "return=representation" }
    });
  }

  async function createProduct(fields) {
    return authenticatedRequest("/rest/v1/territorial_products", {
      method: "POST",
      body: fields,
      headers: { Prefer: "return=representation" }
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
    bookings,
    claimInitialAccess,
    configured,
    loadSession,
    logout: () => saveSession(null),
    sendMagicLink,
    createProduct,
    products,
    fieldOperators,
    setCapacityDay,
    setBookingStatus,
    setFieldOperator,
    titleChecks,
    updateProduct,
    validSession
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
