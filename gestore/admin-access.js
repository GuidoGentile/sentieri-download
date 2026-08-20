(function setupManagerAccessConsole() {
  "use strict";

  const model = window.SentieriManagerAccessModel;
  const api = window.SentieriSupabase;
  const summaryGrid = document.getElementById("summary-calendar-grid");
  const detailGrid = document.getElementById("calendar-grid");
  if (!model || !api || !summaryGrid || !detailGrid) return;

  const STATUS_LABELS = { confermata: "Confermata", trattenuta: "In attesa", annullata: "Annullata" };
  const GROUP_LABELS = {
    booking_free: "Numero chiuso", booking_paid: "Numero chiuso", limited: "Numero chiuso",
    closed: "Chiusi", free: "Liberi", unconfigured: "Da configurare"
  };

  const dataBadge = document.getElementById("access-data-badge");
  const summaryEntity = document.getElementById("summary-calendar-entity");
  const summaryMonthLabel = document.getElementById("summary-calendar-month-label");
  const summaryPrevious = document.getElementById("summary-calendar-previous-month");
  const summaryNext = document.getElementById("summary-calendar-next-month");
  const summaryBookingCount = document.getElementById("summary-booking-count");
  const summaryBookedPeople = document.getElementById("summary-booked-people");
  const summaryDayTitle = document.getElementById("summary-day-title");
  const summaryDayBookings = document.getElementById("summary-day-bookings");
  const summaryDayPeople = document.getElementById("summary-day-people");
  const summaryDayFree = document.getElementById("summary-day-free");
  const summaryDayLimited = document.getElementById("summary-day-limited");
  const summaryDayClosed = document.getElementById("summary-day-closed");
  const summaryDayUnconfigured = document.getElementById("summary-day-unconfigured");
  const summaryDaySearch = document.getElementById("summary-day-search");
  const summaryDayProducts = document.getElementById("summary-day-products");
  const summaryMessage = document.getElementById("summary-calendar-message");

  const detailMonthLabel = document.getElementById("calendar-month-label");
  const detailPrevious = document.getElementById("calendar-previous-month");
  const detailNext = document.getElementById("calendar-next-month");
  const editorTitle = document.getElementById("day-editor-title");
  const editorTrail = document.getElementById("day-editor-trail");
  const accessKind = document.getElementById("day-access-kind");
  const capacityField = document.getElementById("day-capacity-field");
  const capacityInput = document.getElementById("day-capacity");
  const dayBooked = document.getElementById("day-booked");
  const dayRemaining = document.getElementById("day-remaining");
  const saveDay = document.getElementById("save-day-access");
  const editorMessage = document.getElementById("day-editor-message");
  const dayBookingCount = document.getElementById("day-booking-count");
  const dayBookingList = document.getElementById("day-booking-list");

  const today = new Date();
  const todayKey = model.dateKey(today.getFullYear(), today.getMonth(), today.getDate());
  let summaryYear = today.getFullYear();
  let summaryMonth = today.getMonth();
  let selectedSummaryDate = todayKey;
  let summaryRows = [];
  let selectedDayRows = [];
  let availableEntities = [];
  let summaryRequest = 0;
  let summaryDayRequest = 0;

  let detailTrail = null;
  let detailYear = today.getFullYear();
  let detailMonth = today.getMonth();
  let selectedDetailDate = todayKey;
  let detailCalendar = {};
  let detailBookings = [];
  let detailRequest = 0;

  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function formatDate(date, options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }) {
    return new Intl.DateTimeFormat("it-IT", options).format(new Date(`${date}T12:00:00`));
  }

  function monthRange(year, month) {
    return { from: model.dateKey(year, month, 1), to: model.dateKey(year, month, model.daysInMonth(year, month)) };
  }

  function monthName(year, month) {
    return new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
  }

  function number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function bookingFromRow(row, entityCode = null) {
    return {
      id: row.booking_id, code: row.permit_code || row.booking_id,
      customerName: row.customer_email || "Utente Sentieri", email: row.customer_email || "—",
      entityCode: entityCode || row.entity_code || null, trailId: row.product_id,
      trailCode: row.product_code, trailName: row.product_name, date: row.access_date,
      mode: "a_piedi", quantity: number(row.party_size),
      status: row.booking_status === "confirmed" ? "confermata" : row.booking_status === "cancelled" ? "annullata" : "trattenuta"
    };
  }

  async function loadEntities(access) {
    const all = await api.entities();
    const superadmin = access.some((item) => item.staff_role === "superadmin");
    const allowed = new Set(access.map((item) => item.entity_code).filter(Boolean));
    availableEntities = superadmin ? all : all.filter((item) => allowed.has(item.code));
    summaryEntity.innerHTML = '<option value="">Tutti gli enti gestiti</option>'
      + availableEntities.map((item) => `<option value="${escapeHtml(item.code)}">${escapeHtml(item.name)}</option>`).join("");
    if (!superadmin && availableEntities.length === 1) summaryEntity.value = availableEntities[0].code;
  }

  function summaryRow(date) {
    return summaryRows.find((row) => row.day === date) || {
      day: date, booking_count: 0, booked_people: 0, free_trails: 0,
      limited_trails: 0, closed_trails: 0, unconfigured_trails: 0
    };
  }

  function renderSummaryDayCounts() {
    const row = summaryRow(selectedSummaryDate);
    summaryDayTitle.textContent = formatDate(selectedSummaryDate);
    summaryDayBookings.textContent = number(row.booking_count).toLocaleString("it-IT");
    summaryDayPeople.textContent = number(row.booked_people).toLocaleString("it-IT");
    summaryDayFree.textContent = number(row.free_trails).toLocaleString("it-IT");
    summaryDayLimited.textContent = number(row.limited_trails).toLocaleString("it-IT");
    summaryDayClosed.textContent = number(row.closed_trails).toLocaleString("it-IT");
    summaryDayUnconfigured.textContent = number(row.unconfigured_trails).toLocaleString("it-IT");
  }

  function renderSummary() {
    summaryMonthLabel.textContent = monthName(summaryYear, summaryMonth);
    summaryBookingCount.textContent = summaryRows.reduce((total, row) => total + number(row.booking_count), 0).toLocaleString("it-IT");
    summaryBookedPeople.textContent = summaryRows.reduce((total, row) => total + number(row.booked_people), 0).toLocaleString("it-IT");
    const firstWeekday = (new Date(summaryYear, summaryMonth, 1).getDay() + 6) % 7;
    const cells = Array.from({ length: firstWeekday }, () => '<span class="calendar-day calendar-day--empty" aria-hidden="true"></span>');
    for (let day = 1; day <= model.daysInMonth(summaryYear, summaryMonth); day += 1) {
      const date = model.dateKey(summaryYear, summaryMonth, day);
      const row = summaryRow(date);
      const selected = date === selectedSummaryDate;
      const todayClass = date === todayKey ? " calendar-day--today" : "";
      cells.push(`<button type="button" class="calendar-day summary-calendar-day${todayClass}${selected ? " calendar-day--selected" : ""}" data-summary-date="${date}" aria-pressed="${selected}">
        <span class="calendar-day__number">${day}</span><strong>${number(row.booking_count).toLocaleString("it-IT")} pren.</strong>
        <small>${number(row.free_trails).toLocaleString("it-IT")} liberi · ${number(row.limited_trails).toLocaleString("it-IT")} numero chiuso</small>
        <small>${number(row.closed_trails).toLocaleString("it-IT")} chiusi · ${number(row.unconfigured_trails).toLocaleString("it-IT")} da configurare</small>
      </button>`);
    }
    summaryGrid.innerHTML = cells.join("");
    renderSummaryDayCounts();
  }

  function normalizedAccessType(value) {
    return value === "booking_free" || value === "booking_paid" ? "limited" : value || "unconfigured";
  }

  function renderSummaryDayProducts() {
    const query = summaryDaySearch.value.trim().toLocaleLowerCase("it-IT");
    const filtered = selectedDayRows.filter((row) => !query || [row.product_code, row.product_name, row.entity_code]
      .some((value) => String(value || "").toLocaleLowerCase("it-IT").includes(query)));
    const markup = ["limited", "closed", "free", "unconfigured"].map((kind) => {
      const rows = filtered.filter((row) => normalizedAccessType(row.access_type) === kind);
      if (!rows.length) return "";
      const items = rows.map((row) => {
        const metrics = kind === "limited" ? `${number(row.booked_people)} prenotati${row.remaining_places === null ? "" : ` · ${number(row.remaining_places)} liberi`}`
          : kind === "unconfigured" ? "Regime da definire" : GROUP_LABELS[row.access_type] || kind;
        return `<button type="button" class="summary-product-link" data-open-product="${escapeHtml(row.product_id)}"><span>
          <strong>${escapeHtml(row.product_code || "Senza codice")} · ${escapeHtml(row.product_name)}</strong>
          <small>${escapeHtml(row.entity_code)} · ${escapeHtml(metrics)}</small></span><i>Apri percorso</i></button>`;
      }).join("");
      const open = kind === "limited" || kind === "closed" || Boolean(query);
      return `<details class="summary-product-group" ${open ? "open" : ""}><summary><span>${escapeHtml(GROUP_LABELS[kind])}</span><strong>${rows.length.toLocaleString("it-IT")}</strong></summary><div>${items}</div></details>`;
    }).join("");
    summaryDayProducts.innerHTML = markup || '<p class="muted">Nessun percorso corrisponde alla ricerca.</p>';
  }

  async function loadSummaryDay() {
    const request = ++summaryDayRequest;
    const requestedDate = selectedSummaryDate;
    const requestedEntity = summaryEntity.value || null;
    summaryDayProducts.innerHTML = '<p class="muted">Caricamento…</p>';
    try {
      const rows = await api.calendarDayProducts(requestedEntity, requestedDate);
      if (request !== summaryDayRequest || requestedDate !== selectedSummaryDate || requestedEntity !== (summaryEntity.value || null)) return;
      selectedDayRows = rows;
      renderSummaryDayProducts();
    } catch (error) {
      if (request !== summaryDayRequest) return;
      selectedDayRows = [];
      summaryDayProducts.innerHTML = '<p class="muted">Elenco non disponibile.</p>';
      summaryMessage.textContent = error.message || "Riepilogo giornaliero non disponibile.";
      summaryMessage.classList.add("admin-message--error");
    }
  }

  async function loadSummary() {
    const request = ++summaryRequest;
    summaryMessage.textContent = "";
    summaryMessage.classList.remove("admin-message--error");
    try {
      const range = monthRange(summaryYear, summaryMonth);
      const rows = await api.calendarOverview(summaryEntity.value || null, range.from, range.to);
      if (request !== summaryRequest) return;
      summaryRows = rows;
      dataBadge.textContent = "Dati online";
      renderSummary();
      await loadSummaryDay();
    } catch (error) {
      if (request !== summaryRequest) return;
      summaryRows = [];
      renderSummary();
      summaryMessage.textContent = error.message || "Calendario generale non disponibile.";
      summaryMessage.classList.add("admin-message--error");
    }
  }

  function detailEntry(date) {
    return model.normalizeAccessEntry(detailCalendar[model.accessKey(detailTrail.id, "a_piedi", date)] || { kind: "unconfigured" });
  }

  function renderDetailEditor() {
    if (!detailTrail) return;
    const entry = detailEntry(selectedDetailDate);
    const availability = model.availabilityForDay(entry, detailBookings, detailTrail.id, "a_piedi", selectedDetailDate);
    const bookings = model.bookingsForDay(detailBookings, detailTrail.id, "a_piedi", selectedDetailDate, true);
    editorTitle.textContent = formatDate(selectedDetailDate);
    editorTrail.textContent = `${detailTrail.code ? `${detailTrail.code} · ` : ""}${detailTrail.name}`;
    accessKind.value = entry.kind;
    capacityInput.value = entry.capacity ?? "";
    capacityField.hidden = entry.kind !== "limited";
    dayBooked.textContent = availability.booked.toLocaleString("it-IT");
    dayRemaining.textContent = availability.remaining === null ? "—" : availability.remaining.toLocaleString("it-IT");
    dayBookingCount.textContent = bookings.length.toLocaleString("it-IT");
    dayBookingList.innerHTML = bookings.length ? bookings.map((item) => `<article class="day-booking-item">
      <div><strong>${escapeHtml(item.customerName)}</strong><small>${escapeHtml(item.code)} · ${item.quantity} ${item.quantity === 1 ? "posto" : "posti"}</small></div>
      <div class="day-booking-actions"><span class="booking-status booking-status--${escapeHtml(item.status)}">${escapeHtml(STATUS_LABELS[item.status])}</span>${item.status !== "annullata" ? `<button type="button" class="outline booking-cancel" data-booking-id="${escapeHtml(item.id)}">Annulla</button>` : ""}</div>
    </article>`).join("") : '<p class="muted">Nessuna prenotazione.</p>';
    editorMessage.textContent = "";
    editorMessage.classList.remove("admin-message--error");
  }

  function renderDetailCalendar() {
    if (!detailTrail) return;
    detailMonthLabel.textContent = monthName(detailYear, detailMonth);
    const firstWeekday = (new Date(detailYear, detailMonth, 1).getDay() + 6) % 7;
    const cells = Array.from({ length: firstWeekday }, () => '<span class="calendar-day calendar-day--empty" aria-hidden="true"></span>');
    for (let day = 1; day <= model.daysInMonth(detailYear, detailMonth); day += 1) {
      const date = model.dateKey(detailYear, detailMonth, day);
      const availability = model.availabilityForDay(detailEntry(date), detailBookings, detailTrail.id, "a_piedi", date);
      let statusClass = availability.kind;
      let main = availability.kind === "free" ? "Libero" : availability.kind === "closed" ? "Chiuso" : "Da configurare";
      let note = availability.kind === "unconfigured" ? "Nessun regime" : "";
      if (availability.kind === "limited") {
        statusClass = availability.soldOut ? "sold-out" : "limited";
        main = availability.soldOut ? "Esaurito" : `${availability.remaining} liberi`;
        note = `${availability.booked} / ${availability.capacity} prenotati`;
      }
      cells.push(`<button type="button" class="calendar-day calendar-day--${statusClass}${date === todayKey ? " calendar-day--today" : ""}${date === selectedDetailDate ? " calendar-day--selected" : ""}" data-detail-date="${date}">
        <span class="calendar-day__number">${day}</span><strong>${escapeHtml(main)}</strong><small>${escapeHtml(note)}</small></button>`);
    }
    detailGrid.innerHTML = cells.join("");
    renderDetailEditor();
  }

  async function loadTrailDetail() {
    if (!detailTrail) return;
    const request = ++detailRequest;
    const requestedTrail = detailTrail;
    const requestedYear = detailYear;
    const requestedMonth = detailMonth;
    try {
      const range = monthRange(requestedYear, requestedMonth);
      const [availabilityRows, bookingRows] = await Promise.all([
        api.availability(requestedTrail.id, range.from, range.to), api.productBookings(requestedTrail.id, range.from, range.to)
      ]);
      if (request !== detailRequest || requestedTrail.id !== detailTrail?.id || requestedYear !== detailYear || requestedMonth !== detailMonth) return;
      detailCalendar = {};
      for (let day = 1; day <= model.daysInMonth(requestedYear, requestedMonth); day += 1) {
        const date = model.dateKey(requestedYear, requestedMonth, day);
        detailCalendar[model.accessKey(requestedTrail.id, "a_piedi", date)] = { kind: "unconfigured", capacity: null, serverBooked: 0 };
      }
      availabilityRows.forEach((row) => {
        const kind = row.access_type === "free" ? "free" : row.access_type === "closed" ? "closed" : "limited";
        detailCalendar[model.accessKey(requestedTrail.id, "a_piedi", row.day)] = {
          kind, capacity: row.daily_capacity,
          serverBooked: row.daily_capacity == null || row.remaining_places == null ? 0 : Math.max(0, row.daily_capacity - row.remaining_places)
        };
      });
      detailBookings = bookingRows.map((row) => bookingFromRow(row, requestedTrail.entityCode));
      renderDetailCalendar();
    } catch (error) {
      if (request !== detailRequest) return;
      editorMessage.textContent = error.message || "Calendario del percorso non disponibile.";
      editorMessage.classList.add("admin-message--error");
    }
  }

  async function cancelBooking(item) {
    if (!item || !window.confirm(`Annullare la prenotazione ${item.code}?`)) return;
    await api.setBookingStatus(item.entityCode, item.id, "cancelled", "Annullata dalla console gestore");
    if (detailTrail?.id === item.trailId) await loadTrailDetail();
    await loadSummary();
  }

  summaryGrid.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-summary-date]");
    if (!button) return;
    selectedSummaryDate = button.dataset.summaryDate;
    renderSummary();
    await loadSummaryDay();
  });
  summaryDaySearch.addEventListener("input", renderSummaryDayProducts);
  summaryDayProducts.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-product]");
    if (!button) return;
    window.dispatchEvent(new CustomEvent("sentieri:open-manager-trail", { detail: { productId: button.dataset.openProduct, date: selectedSummaryDate } }));
  });

  function changeSummaryMonth(offset) {
    const next = new Date(summaryYear, summaryMonth + offset, 1);
    summaryYear = next.getFullYear(); summaryMonth = next.getMonth();
    selectedSummaryDate = model.dateKey(summaryYear, summaryMonth, 1);
    loadSummary();
  }
  summaryPrevious.addEventListener("click", () => changeSummaryMonth(-1));
  summaryNext.addEventListener("click", () => changeSummaryMonth(1));
  summaryEntity.addEventListener("change", loadSummary);

  detailGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-detail-date]");
    if (!button) return;
    selectedDetailDate = button.dataset.detailDate;
    renderDetailCalendar();
  });
  accessKind.addEventListener("change", () => {
    capacityField.hidden = accessKind.value !== "limited";
    if (accessKind.value === "limited" && !capacityInput.value) capacityInput.value = "30";
  });
  saveDay.addEventListener("click", async () => {
    if (!detailTrail) return;
    const currentBooked = model.bookedUnits(detailBookings, detailTrail.id, "a_piedi", selectedDetailDate);
    const kind = accessKind.value;
    const capacity = Number.parseInt(capacityInput.value, 10);
    if (kind === "limited" && (!Number.isFinite(capacity) || capacity < Math.max(1, currentBooked) || capacity > 999)) {
      editorMessage.textContent = `La capienza deve essere compresa tra ${Math.max(1, currentBooked)} e 999 posti.`;
      editorMessage.classList.add("admin-message--error"); return;
    }
    if (kind !== "limited" && currentBooked > 0) {
      editorMessage.textContent = `La giornata ha ${currentBooked} posti impegnati: prima occorre gestire quelle prenotazioni.`;
      editorMessage.classList.add("admin-message--error"); return;
    }
    try {
      saveDay.disabled = true;
      await api.setCapacityDay(detailTrail.id, selectedDetailDate, kind === "limited" ? "booking_free" : kind, kind === "limited" ? capacity : null, "Modifica dalla scheda percorso");
      await Promise.all([loadTrailDetail(), loadSummary()]);
    } catch (error) {
      editorMessage.textContent = error.message || "Salvataggio non riuscito.";
      editorMessage.classList.add("admin-message--error");
    } finally { saveDay.disabled = false; }
  });
  dayBookingList.addEventListener("click", async (event) => {
    const button = event.target.closest(".booking-cancel");
    if (!button) return;
    const item = detailBookings.find((booking) => booking.id === button.dataset.bookingId);
    try { await cancelBooking(item); } catch (error) { window.alert(error.message || "Annullamento non riuscito."); }
  });

  function changeDetailMonth(offset) {
    const next = new Date(detailYear, detailMonth + offset, 1);
    detailYear = next.getFullYear(); detailMonth = next.getMonth();
    selectedDetailDate = model.dateKey(detailYear, detailMonth, 1);
    loadTrailDetail();
  }
  detailPrevious.addEventListener("click", () => changeDetailMonth(-1));
  detailNext.addEventListener("click", () => changeDetailMonth(1));

  window.addEventListener("sentieri:manager-trail-detail-opened", (event) => {
    detailTrail = event.detail?.trail || null;
    const requestedDate = event.detail?.date || todayKey;
    const [year, month] = requestedDate.split("-").map(Number);
    detailYear = year; detailMonth = month - 1; selectedDetailDate = requestedDate;
    loadTrailDetail();
  });

  window.addEventListener("sentieri:manager-online", async (event) => {
    try {
      await loadEntities(event.detail?.access || []);
      await loadSummary();
    } catch (error) {
      summaryMessage.textContent = error.message || "Dati gestore non disponibili.";
      summaryMessage.classList.add("admin-message--error");
    }
  });

  renderSummary();
})();
