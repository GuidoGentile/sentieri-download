(function setupStaffRoles() {
  "use strict";

  const api = window.SentieriSupabase;
  const panel = document.getElementById("staff-access");
  const badge = document.getElementById("staff-access-badge");
  const currentAccess = document.getElementById("staff-current-access");
  const entitySelect = document.getElementById("staff-entity-select");
  const staffForm = document.getElementById("staff-member-form");
  const staffEmail = document.getElementById("staff-member-email");
  const staffRole = document.getElementById("staff-member-role");
  const staffActive = document.getElementById("staff-member-active");
  const staffReason = document.getElementById("staff-member-reason");
  const staffMessage = document.getElementById("staff-member-message");
  const staffList = document.getElementById("staff-member-list");
  const superadminPanel = document.getElementById("superadmin-management");
  const superadminForm = document.getElementById("superadmin-form");
  const superadminEmail = document.getElementById("superadmin-email");
  const superadminActive = document.getElementById("superadmin-active");
  const superadminReason = document.getElementById("superadmin-reason");
  const superadminMessage = document.getElementById("superadmin-message");
  const superadminList = document.getElementById("superadmin-list");
  const auditList = document.getElementById("staff-audit-list");
  if (!api || !panel || !entitySelect || !staffForm || !superadminForm) return;

  const ROLE_LABELS = {
    superadmin: "Superadmin",
    admin: "Amministratore",
    operator: "Operatore",
    reader: "Lettore"
  };
  const ACTION_LABELS = {
    superadmin_granted: "Superadmin nominato",
    superadmin_revoked: "Superadmin revocato",
    staff_role_assigned: "Ruolo assegnato",
    staff_access_suspended: "Accesso sospeso",
    field_operator_assigned: "Guardiaparco abilitato",
    field_operator_suspended: "Guardiaparco sospeso",
    product_created: "Percorso creato",
    product_updated: "Percorso modificato",
    capacity_day_updated: "Calendario o capienza modificati",
    booking_status_changed: "Stato prenotazione modificato"
  };

  let accessRows = [];
  let isSuperadmin = false;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDateTime(value) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("it-IT", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  }

  function showMessage(element, text, error = false) {
    element.textContent = text;
    element.classList.toggle("admin-message--error", error);
  }

  function friendlyError(error) {
    const message = String(error?.message || "Operazione non riuscita.");
    if (message.includes("last active superadmin")) return "L’ultimo Superadmin attivo non può essere revocato.";
    if (message.includes("cannot revoke their own")) return "Un Superadmin non può revocare il proprio ruolo.";
    if (message.includes("create and confirm")) return "L’utente deve prima accedere e confermare il proprio account email.";
    if (message.includes("reason required")) return "Inserisci una motivazione.";
    if (message.includes("authorization required")) return "Il ruolo corrente non consente questa operazione.";
    return message;
  }

  function canAdminister(entityCode) {
    return isSuperadmin || accessRows.some((row) => row.entity_code === entityCode && row.staff_role === "admin");
  }

  function renderCurrentAccess() {
    if (isSuperadmin) {
      currentAccess.innerHTML = "Ruolo corrente: <strong>Superadmin</strong> · accesso globale alla piattaforma.";
      return;
    }
    const labels = accessRows.map((row) => `${ROLE_LABELS[row.staff_role] || row.staff_role} · ${row.entity_code}`);
    currentAccess.innerHTML = labels.length
      ? `Ruoli correnti: <strong>${escapeHtml(labels.join("; "))}</strong>.`
      : "Nessun ruolo attivo.";
  }

  function renderStaff(rows) {
    staffList.innerHTML = rows.length ? rows.map((item) => `
      <article class="operation-row">
        <div><strong>${escapeHtml(item.email)}</strong><small>${escapeHtml(ROLE_LABELS[item.staff_role] || item.staff_role)} · aggiornato ${escapeHtml(formatDateTime(item.updated_at))}</small></div>
        <span class="operation-result ${item.active ? "operation-result--valid" : "operation-result--revoked"}">${item.active ? "Attivo" : "Sospeso"}</span>
      </article>`).join("") : '<p class="muted">Nessun ruolo assegnato a questo ente.</p>';
  }

  function renderSuperadmins(rows) {
    superadminList.innerHTML = rows.length ? rows.map((item) => `
      <article class="operation-row">
        <div><strong>${escapeHtml(item.email)}</strong><small>${item.revocation_reason ? `Ultima motivazione: ${escapeHtml(item.revocation_reason)}` : "Ruolo globale"}</small></div>
        <span class="operation-result ${item.active ? "operation-result--valid" : "operation-result--revoked"}">${item.active ? "Attivo" : "Revocato"}</span>
      </article>`).join("") : '<p class="muted">Nessun Superadmin disponibile.</p>';
  }

  function renderAudit(rows) {
    auditList.innerHTML = rows.length ? rows.map((item) => `
      <article class="operation-row staff-audit-row">
        <div>
          <strong>${escapeHtml(ACTION_LABELS[item.action] || item.action)}</strong>
          <small>${escapeHtml(item.actor_email || "Account rimosso")} · ${escapeHtml(formatDateTime(item.occurred_at))}${item.reason ? ` · ${escapeHtml(item.reason)}` : ""}</small>
        </div>
        <span class="operation-result">${escapeHtml(item.entity_code || "Piattaforma")}</span>
      </article>`).join("") : '<p class="muted">Nessuna operazione amministrativa registrata.</p>';
  }

  async function loadEntityData() {
    const entityCode = entitySelect.value;
    if (!entityCode) return;
    const allowed = canAdminister(entityCode);
    [...staffForm.elements].forEach((element) => { element.disabled = !allowed; });
    if (!allowed) {
      staffList.innerHTML = '<p class="muted">Solo un Amministratore dell’ente o un Superadmin può gestire gli accessi.</p>';
      auditList.innerHTML = '<p class="muted">L’audit è riservato agli Amministratori e ai Superadmin.</p>';
      return;
    }
    try {
      const [staff, audit] = await Promise.all([
        api.staffMembers(entityCode),
        api.auditEvents(entityCode, 80)
      ]);
      renderStaff(staff);
      renderAudit(audit);
    } catch (error) {
      staffList.innerHTML = `<p class="review-error">${escapeHtml(friendlyError(error))}</p>`;
    }
  }

  async function loadSuperadmins() {
    superadminPanel.hidden = !isSuperadmin;
    if (!isSuperadmin) return;
    try {
      renderSuperadmins(await api.superadmins());
    } catch (error) {
      superadminList.innerHTML = `<p class="review-error">${escapeHtml(friendlyError(error))}</p>`;
    }
  }

  async function initialize(providedAccess = null) {
    try {
      accessRows = providedAccess || await api.currentAccess();
      if (!accessRows.length) return;
      isSuperadmin = accessRows.some((row) => row.staff_role === "superadmin");
      badge.textContent = "Registro centrale";
      renderCurrentAccess();

      const allEntities = await api.entities();
      const allowedEntityCodes = new Set(accessRows.map((row) => row.entity_code).filter(Boolean));
      const visibleEntities = isSuperadmin ? allEntities : allEntities.filter((entity) => allowedEntityCodes.has(entity.code));
      entitySelect.innerHTML = visibleEntities.map((entity) => `<option value="${escapeHtml(entity.code)}">${escapeHtml(entity.name)}</option>`).join("");
      await Promise.all([loadEntityData(), loadSuperadmins()]);
    } catch (error) {
      currentAccess.textContent = friendlyError(error);
      currentAccess.classList.add("review-error");
    }
  }

  staffForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage(staffMessage, "Salvataggio in corso…");
    try {
      await api.setStaffMember(
        entitySelect.value,
        staffEmail.value.trim(),
        staffRole.value,
        staffActive.value === "true",
        staffReason.value.trim()
      );
      showMessage(staffMessage, "Ruolo aggiornato e registrato nell’audit.");
      staffForm.reset();
      await loadEntityData();
    } catch (error) {
      showMessage(staffMessage, friendlyError(error), true);
    }
  });

  superadminForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const active = superadminActive.value === "true";
    const verb = active ? "nominare" : "revocare";
    if (!window.confirm(`Confermi di ${verb} il ruolo Superadmin per ${superadminEmail.value.trim()}?`)) return;
    showMessage(superadminMessage, "Operazione in corso…");
    try {
      await api.setSuperadmin(superadminEmail.value.trim(), active, superadminReason.value.trim());
      showMessage(superadminMessage, "Operazione registrata. La notifica email è stata accodata.");
      superadminForm.reset();
      await Promise.all([loadSuperadmins(), loadEntityData()]);
    } catch (error) {
      showMessage(superadminMessage, friendlyError(error), true);
    }
  });

  entitySelect.addEventListener("change", loadEntityData);
  window.addEventListener("sentieri:manager-online", (event) => initialize(event.detail?.access));
  api.validSession().then((session) => { if (session) initialize(); });
})();
