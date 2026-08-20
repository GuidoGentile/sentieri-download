(function setupFieldOperations() {
  "use strict";

  const api = window.SentieriSupabase;
  const form = document.getElementById("manager-operator-form");
  const email = document.getElementById("manager-operator-email");
  const role = document.getElementById("manager-operator-role");
  const active = document.getElementById("manager-operator-active");
  const message = document.getElementById("manager-operator-message");
  const operatorsList = document.getElementById("manager-operators-list");
  const operatorEntity = document.getElementById("manager-operator-entity-select");
  const checksEntity = document.getElementById("field-checks-entity-select");
  const checksList = document.getElementById("manager-checks-list");
  const badge = document.getElementById("field-operations-badge");
  if (!api || !form || !email || !role || !active || !message || !operatorsList || !operatorEntity || !checksEntity || !checksList || !badge) return;

  let accessRows = [];

  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function resultLabel(result) {
    return ({ valid: "Valido", not_found: "Non trovato", cancelled: "Annullato", pending_payment: "Pagamento atteso", revoked: "Revocato", expired: "Scaduto", not_yet_valid: "Non ancora valido" })[result] || result;
  }

  function formatDateTime(value) {
    return new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  }

  function isSuperadmin() {
    return accessRows.some((item) => item.staff_role === "superadmin");
  }

  function canAdminister(entityCode) {
    return isSuperadmin() || accessRows.some((item) => item.entity_code === entityCode && item.staff_role === "admin");
  }

  function visibleEntities(entities) {
    if (isSuperadmin()) return entities;
    const allowed = new Set(accessRows.map((item) => item.entity_code).filter(Boolean));
    return entities.filter((entity) => allowed.has(entity.code));
  }

  function renderOperators(rows) {
    operatorsList.innerHTML = rows.length ? rows.map((item) => `
      <article class="operation-row"><div><strong>${escapeHtml(item.email)}</strong><small>${item.operator_role === "supervisor" ? "Supervisore" : "Guardiaparco"}</small></div><span class="operation-result ${item.active ? "operation-result--valid" : "operation-result--revoked"}">${item.active ? "Attivo" : "Sospeso"}</span></article>`).join("") : '<p class="muted">Nessun operatore Guardiaparco assegnato a questo ente.</p>';
  }

  function renderChecks(rows) {
    checksList.innerHTML = rows.length ? rows.map((item) => `
      <article class="operation-row"><div><strong>${escapeHtml(item.permit_code || "Codice sconosciuto")}</strong><small>${escapeHtml(item.product_code || "—")} · ${formatDateTime(item.checked_at)}</small></div><span class="operation-result operation-result--${escapeHtml(item.check_result)}">${escapeHtml(resultLabel(item.check_result))}</span></article>`).join("") : '<p class="muted">Nessun controllo negli ultimi 30 giorni.</p>';
  }

  async function loadOperators() {
    const entityCode = operatorEntity.value;
    if (!entityCode || !(await api.validSession())) return;
    const allowed = canAdminister(entityCode);
    [...form.elements].forEach((element) => { element.disabled = !allowed; });
    if (!allowed) {
      operatorsList.innerHTML = '<p class="muted">Solo un Amministratore dell’ente o un Superadmin può gestire gli operatori Guardiaparco.</p>';
      return;
    }
    try {
      renderOperators(await api.fieldOperators(entityCode));
    } catch (error) {
      operatorsList.innerHTML = `<p class="review-error">${escapeHtml(error.message)}</p>`;
    }
  }

  async function loadChecks() {
    const entityCode = checksEntity.value;
    if (!entityCode || !(await api.validSession())) return;
    try {
      const from = new Date(Date.now() - 30 * 86400000).toISOString();
      const to = new Date(Date.now() + 86400000).toISOString();
      renderChecks(await api.titleChecks(entityCode, from, to));
    } catch (error) {
      checksList.innerHTML = `<p class="review-error">${escapeHtml(error.message)}</p>`;
    }
  }

  async function initialize(providedAccess = null) {
    if (!(await api.validSession())) return;
    try {
      accessRows = providedAccess || await api.currentAccess();
      const entities = visibleEntities(await api.entities());
      const options = entities.map((entity) => `<option value="${escapeHtml(entity.code)}">${escapeHtml(entity.name)}</option>`).join("");
      operatorEntity.innerHTML = options;
      checksEntity.innerHTML = options;
      badge.textContent = "Registro centrale";
      await Promise.all([loadOperators(), loadChecks()]);
    } catch (error) {
      checksList.innerHTML = `<p class="review-error">${escapeHtml(error.message)}</p>`;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const entityCode = operatorEntity.value;
    const enabled = active.value === "true";
    message.textContent = "Salvataggio in corso…";
    message.classList.remove("admin-message--error");
    try {
      await api.setFieldOperator(entityCode, email.value.trim(), role.value, enabled);
      message.textContent = enabled ? "Operatore abilitato e registrato nell’audit." : "Accesso sospeso e registrato nell’audit.";
      form.reset();
      await loadOperators();
    } catch (error) {
      message.textContent = error.message || "Aggiornamento non riuscito.";
      message.classList.add("admin-message--error");
    }
  });

  operatorEntity.addEventListener("change", loadOperators);
  checksEntity.addEventListener("change", loadChecks);
  window.addEventListener("sentieri:manager-online", (event) => initialize(event.detail?.access));
  api.validSession().then((session) => { if (session) initialize(); });
})();
