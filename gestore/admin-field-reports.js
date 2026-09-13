(function setupFieldReportsManager() {
  "use strict";

  const api = window.SentieriSupabase;
  const entitySelect = document.getElementById("field-reports-entity-select");
  const statusSelect = document.getElementById("field-reports-status-select");
  const list = document.getElementById("field-reports-list");
  const message = document.getElementById("field-reports-message");
  if (!api || !entitySelect || !statusSelect || !list || !message) return;

  const categoryLabels = Object.freeze({
    fallen_tree: "Albero caduto",
    missing_sign: "Segnaletica assente",
    landslide: "Frana o tratto pericoloso",
    dry_spring: "Fonte asciutta",
    other: "Altro"
  });
  const statusLabels = Object.freeze({
    received: "Ricevuta",
    verified: "Verificata",
    resolved: "Risolta",
    rejected: "Non confermata"
  });
  let accessRows = [];
  let isSuperadmin = false;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Data non disponibile" : date.toLocaleString("it-IT");
  }

  function canWrite(entityCode) {
    return isSuperadmin || accessRows.some((row) =>
      row.entity_code === entityCode && new Set(["admin", "operator"]).has(row.staff_role)
    );
  }

  function reportMarkup(report) {
    const writable = canWrite(report.entity_code);
    const coordinates = `${Number(report.latitude).toFixed(5)}, ${Number(report.longitude).toFixed(5)}`;
    const mapUrl = `https://www.openstreetmap.org/?mlat=${encodeURIComponent(report.latitude)}&mlon=${encodeURIComponent(report.longitude)}#map=17/${encodeURIComponent(report.latitude)}/${encodeURIComponent(report.longitude)}`;
    return `<article class="operation-row" data-field-report="${escapeHtml(report.id)}">
      <div class="operation-main">
        <strong>${escapeHtml(categoryLabels[report.category] || report.category)}</strong>
        <span>${escapeHtml(report.product_id)} · ${escapeHtml(formatDate(report.recorded_at))}</span>
        <p>${escapeHtml(report.description || "Nessuna nota dell’utente")}</p>
        <a href="${mapUrl}" target="_blank" rel="noopener">Apri posizione ${escapeHtml(coordinates)}</a>
      </div>
      <div class="operation-result">
        <label class="admin-field"><span>Stato</span><select data-report-status ${writable ? "" : "disabled"}>
          ${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}" ${report.status === value ? "selected" : ""}>${label}</option>`).join("")}
        </select></label>
        <label class="admin-field"><span>Nota per l’utente</span><input data-report-note type="text" maxlength="500" value="${escapeHtml(report.status_note || "")}" ${writable ? "" : "disabled"}></label>
        <button type="button" class="primary" data-save-report ${writable ? "" : "disabled"}>Salva stato</button>
      </div>
    </article>`;
  }

  async function loadReports() {
    if (!entitySelect.value) return;
    message.textContent = "Aggiornamento…";
    try {
      const reports = await api.fieldReports(entitySelect.value, statusSelect.value);
      list.innerHTML = reports.length
        ? reports.map(reportMarkup).join("")
        : '<p class="muted">Nessuna segnalazione per i filtri scelti.</p>';
      message.textContent = `${reports.length} segnalazion${reports.length === 1 ? "e" : "i"}`;
    } catch (error) {
      list.innerHTML = `<p class="review-error">${escapeHtml(error?.message || "Segnalazioni non disponibili")}</p>`;
      message.textContent = "";
    }
  }

  async function initialize(providedAccess = null) {
    try {
      accessRows = providedAccess || await api.currentAccess();
      if (!accessRows.length) return;
      isSuperadmin = accessRows.some((row) => row.staff_role === "superadmin");
      const allEntities = await api.entities();
      const allowed = new Set(accessRows.map((row) => row.entity_code).filter(Boolean));
      const visible = isSuperadmin ? allEntities : allEntities.filter((entity) => allowed.has(entity.code));
      entitySelect.innerHTML = visible.map((entity) =>
        `<option value="${escapeHtml(entity.code)}">${escapeHtml(entity.name)}</option>`
      ).join("");
      await loadReports();
    } catch (error) {
      message.textContent = error?.message || "Accesso alle segnalazioni non disponibile";
      message.classList.add("admin-message--error");
    }
  }

  list.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-save-report]");
    const row = button?.closest("[data-field-report]");
    if (!button || !row) return;
    button.disabled = true;
    message.textContent = "Salvataggio…";
    try {
      await api.updateFieldReport(
        row.dataset.fieldReport,
        row.querySelector("[data-report-status]").value,
        row.querySelector("[data-report-note]").value
      );
      message.textContent = "Stato salvato: l’utente lo riceverà alla prossima sincronizzazione.";
      await loadReports();
    } catch (error) {
      message.textContent = error?.message || "Salvataggio non riuscito";
      message.classList.add("admin-message--error");
    } finally {
      button.disabled = false;
    }
  });

  entitySelect.addEventListener("change", loadReports);
  statusSelect.addEventListener("change", loadReports);
  window.addEventListener("sentieri:manager-online", (event) => initialize(event.detail?.access));
  api.validSession().then((session) => { if (session) initialize(); });
})();
