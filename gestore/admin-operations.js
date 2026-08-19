(function setupFieldOperations() {
  "use strict";

  const api = window.SentieriSupabase;
  const form = document.getElementById("manager-operator-form");
  const email = document.getElementById("manager-operator-email");
  const role = document.getElementById("manager-operator-role");
  const message = document.getElementById("manager-operator-message");
  const operatorsList = document.getElementById("manager-operators-list");
  const checksList = document.getElementById("manager-checks-list");
  const badge = document.getElementById("field-operations-badge");
  if (!api || !form || !operatorsList || !checksList) return;

  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function resultLabel(result) {
    return ({ valid: "Valido", not_found: "Non trovato", cancelled: "Annullato", pending_payment: "Pagamento atteso", revoked: "Revocato", expired: "Scaduto", not_yet_valid: "Non ancora valido" })[result] || result;
  }

  function formatDateTime(value) {
    return new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  }

  async function loadOperations() {
    if (!(await api.validSession())) return;
    badge.textContent = "Registro centrale";
    try {
      const from = new Date(Date.now() - 30 * 86400000).toISOString();
      const to = new Date(Date.now() + 86400000).toISOString();
      const [operators, checks] = await Promise.all([
        api.fieldOperators("PNALM"), api.titleChecks("PNALM", from, to)
      ]);
      operatorsList.innerHTML = operators.length ? operators.map((item) => `
        <article class="operation-row"><div><strong>${escapeHtml(item.email)}</strong><small>${item.operator_role === "supervisor" ? "Supervisore" : "Guardia"}</small></div><span class="operation-result ${item.active ? "operation-result--valid" : "operation-result--revoked"}">${item.active ? "Attivo" : "Sospeso"}</span></article>`).join("") : '<p class="muted">Nessuna Guardia abilitata.</p>';
      checksList.innerHTML = checks.length ? checks.map((item) => `
        <article class="operation-row"><div><strong>${escapeHtml(item.permit_code || "Codice sconosciuto")}</strong><small>${escapeHtml(item.product_code || "—")} · ${formatDateTime(item.checked_at)}</small></div><span class="operation-result operation-result--${escapeHtml(item.check_result)}">${escapeHtml(resultLabel(item.check_result))}</span></article>`).join("") : '<p class="muted">Nessun controllo negli ultimi 30 giorni.</p>';
    } catch (error) {
      checksList.innerHTML = `<p class="review-error">${escapeHtml(error.message)}</p>`;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "Abilitazione in corso…";
    message.classList.remove("admin-message--error");
    try {
      await api.setFieldOperator("PNALM", email.value.trim(), role.value, true);
      message.textContent = "Guardia abilitata. L’operatore può ora accedere all’app.";
      form.reset();
      await loadOperations();
    } catch (error) {
      message.textContent = error.message || "Abilitazione non riuscita.";
      message.classList.add("admin-message--error");
    }
  });

  window.addEventListener("sentieri:manager-online", loadOperations);
  loadOperations();
})();
