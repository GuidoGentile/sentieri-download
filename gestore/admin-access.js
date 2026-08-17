(function setupManagerAccessConsole() {
  "use strict";

  const model = window.SentieriManagerAccessModel;
  const trailSelect = document.getElementById("access-trail-select");
  const modeSelect = document.getElementById("access-mode-select");
  const calendarGrid = document.getElementById("calendar-grid");
  if (!model || !trailSelect || !modeSelect || !calendarGrid) return;

  const STORAGE_KEY = "sentieri.manager-access-demo.v1";
  const MODE_LABELS = {
    a_piedi: "A piedi",
    bici: "Bici",
    ebike: "E-bike",
    cavallo: "Cavallo"
  };
  const STATUS_LABELS = {
    confermata: "Confermata",
    trattenuta: "In attesa",
    annullata: "Annullata"
  };
  const FALLBACK_TRAILS = [
    { id: "pnalm-sit-008-1", code: "A1", name: "Pescasseroli–Rifugio Prato Rosso–Bisegna", official: true },
    { id: "pnalm-sit-040-1", code: "C1", name: "Bocca del Petroso–Forca d’Acero", official: true },
    { id: "pnalm-sit-083-1", code: "E1", name: "La Madonnina–Portella", official: true },
    { id: "pnalm-sit-075-1", code: "F1", name: "Grotta Fondillo–Monte Amaro", official: true },
    { id: "pnalm-sit-087-1", code: "M1", name: "Le Forme–Passo dei Monaci–La Meta", official: true }
  ];

  const monthLabel = document.getElementById("calendar-month-label");
  const previousMonth = document.getElementById("calendar-previous-month");
  const nextMonth = document.getElementById("calendar-next-month");
  const limitedDays = document.getElementById("calendar-limited-days");
  const bookedPlaces = document.getElementById("calendar-booked-places");
  const freePlaces = document.getElementById("calendar-free-places");
  const soldOutDays = document.getElementById("calendar-sold-out-days");
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
  const bookingSearch = document.getElementById("booking-search");
  const bookingStatus = document.getElementById("booking-status-filter");
  const bookingPeriod = document.getElementById("booking-period-filter");
  const bookingTableBody = document.getElementById("booking-table-body");
  const bookingEmpty = document.getElementById("booking-empty-state");
  const bookingVisibleCount = document.getElementById("booking-visible-count");
  const bookingVisiblePeople = document.getElementById("booking-visible-people");
  const resetDemo = document.getElementById("reset-access-demo");

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = model.dateKey(viewYear, viewMonth, Math.min(17, model.daysInMonth(viewYear, viewMonth)));
  let trails = FALLBACK_TRAILS;
  let state = loadState();

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function monthDate(day) {
    return model.dateKey(viewYear, viewMonth, Math.min(day, model.daysInMonth(viewYear, viewMonth)));
  }

  function createSeedState() {
    const year = today.getFullYear();
    const month = today.getMonth();
    const makeDate = (day) => model.dateKey(year, month, Math.min(day, model.daysInMonth(year, month)));
    const a1 = "pnalm-sit-008-1";
    const c1 = "pnalm-sit-040-1";
    const calendar = {};
    [
      [a1, "a_piedi", makeDate(3), "limited", 40],
      [a1, "a_piedi", makeDate(8), "limited", 25],
      [a1, "a_piedi", makeDate(12), "closed", null],
      [a1, "a_piedi", makeDate(17), "limited", 60],
      [a1, "a_piedi", makeDate(22), "limited", 20],
      [a1, "a_piedi", makeDate(27), "limited", 35],
      [a1, "bici", makeDate(17), "limited", 18],
      [c1, "a_piedi", makeDate(10), "limited", 30],
      [c1, "a_piedi", makeDate(24), "limited", 45]
    ].forEach(([trailId, mode, date, kind, capacity]) => {
      calendar[model.accessKey(trailId, mode, date)] = { kind, capacity };
    });
    return {
      schema: "sentieri/manager-access-demo/v1",
      calendar,
      bookings: [
        booking("PN-2401", "Anna Rossi", "anna.rossi@example.test", a1, "A1", "Pescasseroli–Rifugio Prato Rosso–Bisegna", makeDate(3), "a_piedi", 4, "confermata"),
        booking("PN-2402", "Marco De Luca", "marco.deluca@example.test", a1, "A1", "Pescasseroli–Rifugio Prato Rosso–Bisegna", makeDate(3), "a_piedi", 2, "confermata"),
        booking("PN-2403", "Giulia Bianchi", "giulia.bianchi@example.test", a1, "A1", "Pescasseroli–Rifugio Prato Rosso–Bisegna", makeDate(8), "a_piedi", 12, "confermata"),
        booking("PN-2404", "Gruppo Montagna", "gruppo@example.test", a1, "A1", "Pescasseroli–Rifugio Prato Rosso–Bisegna", makeDate(8), "a_piedi", 8, "trattenuta"),
        booking("PN-2405", "Paolo Neri", "paolo.neri@example.test", a1, "A1", "Pescasseroli–Rifugio Prato Rosso–Bisegna", makeDate(8), "a_piedi", 5, "confermata"),
        booking("PN-2406", "Elena Conti", "elena.conti@example.test", a1, "A1", "Pescasseroli–Rifugio Prato Rosso–Bisegna", makeDate(17), "a_piedi", 3, "confermata"),
        booking("PN-2407", "Luca Romano", "luca.romano@example.test", a1, "A1", "Pescasseroli–Rifugio Prato Rosso–Bisegna", makeDate(17), "a_piedi", 6, "confermata"),
        booking("PN-2408", "Sara Gentili", "sara.gentili@example.test", a1, "A1", "Pescasseroli–Rifugio Prato Rosso–Bisegna", makeDate(17), "a_piedi", 2, "annullata"),
        booking("PN-2409", "Associazione Cammini", "cammini@example.test", a1, "A1", "Pescasseroli–Rifugio Prato Rosso–Bisegna", makeDate(22), "a_piedi", 19, "confermata"),
        booking("PN-2410", "Davide Serra", "davide.serra@example.test", a1, "A1", "Pescasseroli–Rifugio Prato Rosso–Bisegna", makeDate(17), "bici", 4, "confermata"),
        booking("PN-2411", "Marta Ferri", "marta.ferri@example.test", c1, "C1", "Bocca del Petroso–Forca d’Acero", makeDate(10), "a_piedi", 5, "confermata"),
        booking("PN-2412", "Enrico Villa", "enrico.villa@example.test", c1, "C1", "Bocca del Petroso–Forca d’Acero", makeDate(24), "a_piedi", 2, "confermata")
      ]
    };
  }

  function booking(code, customerName, email, trailId, trailCode, trailName, date, mode, quantity, status) {
    return { id: code, code, customerName, email, trailId, trailCode, trailName, date, mode, quantity, status };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.schema === "sentieri/manager-access-demo/v1" && saved.calendar && Array.isArray(saved.bookings)) return saved;
    } catch {
      // Un dato locale danneggiato viene sostituito dalla demo riproducibile.
    }
    const seeded = createSeedState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function selectedTrail() {
    return trails.find((trail) => trail.id === trailSelect.value) || trails[0];
  }

  function formatDate(date, options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }) {
    return new Intl.DateTimeFormat("it-IT", options).format(new Date(`${date}T12:00:00`));
  }

  function populateTrailSelect() {
    const current = trailSelect.value || FALLBACK_TRAILS[0].id;
    trailSelect.innerHTML = trails.map((trail) => (
      `<option value="${escapeHtml(trail.id)}">${escapeHtml(trail.code ? `${trail.code} · ` : "")}${escapeHtml(trail.name)}</option>`
    )).join("");
    trailSelect.value = trails.some((trail) => trail.id === current) ? current : trails[0].id;
  }

  function renderCalendar() {
    const trail = selectedTrail();
    const mode = modeSelect.value;
    monthLabel.textContent = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" })
      .format(new Date(viewYear, viewMonth, 1));
    const summary = model.monthSummary(state, trail.id, mode, viewYear, viewMonth);
    limitedDays.textContent = summary.limitedDays.toLocaleString("it-IT");
    bookedPlaces.textContent = summary.booked.toLocaleString("it-IT");
    freePlaces.textContent = summary.remaining.toLocaleString("it-IT");
    soldOutDays.textContent = summary.soldOutDays.toLocaleString("it-IT");

    const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
    const emptyCells = Array.from({ length: firstWeekday }, () => '<span class="calendar-day calendar-day--empty" aria-hidden="true"></span>');
    const days = [];
    for (let day = 1; day <= model.daysInMonth(viewYear, viewMonth); day += 1) {
      const date = model.dateKey(viewYear, viewMonth, day);
      const entry = state.calendar[model.accessKey(trail.id, mode, date)];
      const availability = model.availabilityForDay(entry, state.bookings, trail.id, mode, date);
      const selected = date === selectedDate;
      const todayClass = date === model.dateKey(today.getFullYear(), today.getMonth(), today.getDate()) ? " calendar-day--today" : "";
      let statusClass = "free";
      let mainLabel = "Libero";
      let detailLabel = "Nessuna prenotazione";
      if (availability.kind === "closed") {
        statusClass = "closed";
        mainLabel = "Chiuso";
        detailLabel = "Accesso non disponibile";
      } else if (availability.kind === "limited") {
        statusClass = availability.soldOut ? "sold-out" : "limited";
        mainLabel = availability.soldOut ? "Esaurito" : `${availability.remaining} liberi`;
        detailLabel = `${availability.booked} / ${availability.capacity} prenotati`;
      }
      days.push(`
        <button type="button" class="calendar-day calendar-day--${statusClass}${todayClass}${selected ? " calendar-day--selected" : ""}" data-date="${date}" aria-pressed="${selected}">
          <span class="calendar-day__number">${day}</span>
          <strong>${mainLabel}</strong>
          <small>${detailLabel}</small>
        </button>`);
    }
    calendarGrid.innerHTML = [...emptyCells, ...days].join("");
    renderEditor();
  }

  function renderEditor() {
    const trail = selectedTrail();
    const mode = modeSelect.value;
    const entry = model.normalizeAccessEntry(state.calendar[model.accessKey(trail.id, mode, selectedDate)]);
    const availability = model.availabilityForDay(entry, state.bookings, trail.id, mode, selectedDate);
    const bookings = model.bookingsForDay(state.bookings, trail.id, mode, selectedDate, true);
    editorTitle.textContent = formatDate(selectedDate);
    editorTrail.textContent = `${trail.code ? `${trail.code} · ` : ""}${trail.name} · ${MODE_LABELS[mode]}`;
    accessKind.value = entry.kind;
    capacityInput.value = entry.capacity ?? "";
    capacityField.hidden = entry.kind !== "limited";
    dayBooked.textContent = availability.booked.toLocaleString("it-IT");
    dayRemaining.textContent = availability.remaining === null ? "—" : availability.remaining.toLocaleString("it-IT");
    dayBookingCount.textContent = bookings.length.toLocaleString("it-IT");
    dayBookingList.innerHTML = bookings.length ? bookings.map((item) => `
      <article class="day-booking-item">
        <div><strong>${escapeHtml(item.customerName)}</strong><small>${escapeHtml(item.code)} · ${item.quantity} ${item.quantity === 1 ? "posto" : "posti"}</small></div>
        <span class="booking-status booking-status--${escapeHtml(item.status)}">${escapeHtml(STATUS_LABELS[item.status] || item.status)}</span>
      </article>`).join("") : '<p class="muted">Nessuna prenotazione.</p>';
    editorMessage.textContent = "";
  }

  function renderBookings() {
    const filtered = model.filterBookings(state.bookings, {
      query: bookingSearch.value,
      status: bookingStatus.value,
      period: bookingPeriod.value,
      year: viewYear,
      monthIndex: viewMonth
    });
    bookingVisibleCount.textContent = filtered.length.toLocaleString("it-IT");
    bookingVisiblePeople.textContent = filtered
      .filter((item) => model.ACTIVE_BOOKING_STATUSES.has(item.status))
      .reduce((total, item) => total + item.quantity, 0)
      .toLocaleString("it-IT");
    bookingTableBody.innerHTML = filtered.map((item) => `
      <tr>
        <td><strong>${escapeHtml(item.customerName)}</strong><small>${escapeHtml(item.email)}<br />${escapeHtml(item.code)}</small></td>
        <td><strong>${escapeHtml(item.trailCode || "—")}</strong><small>${escapeHtml(item.trailName)}</small></td>
        <td>${escapeHtml(formatDate(item.date, { day: "2-digit", month: "short", year: "numeric" }))}</td>
        <td>${escapeHtml(MODE_LABELS[item.mode] || item.mode)}</td>
        <td><strong>${item.quantity}</strong></td>
        <td><span class="booking-status booking-status--${escapeHtml(item.status)}">${escapeHtml(STATUS_LABELS[item.status] || item.status)}</span></td>
        <td><button type="button" class="outline booking-open-day" data-booking-id="${escapeHtml(item.id)}">Apri giorno</button></td>
      </tr>`).join("");
    bookingEmpty.hidden = filtered.length > 0;
  }

  function renderAll() {
    renderCalendar();
    renderBookings();
  }

  calendarGrid.addEventListener("click", (event) => {
    const day = event.target.closest("[data-date]");
    if (!day) return;
    selectedDate = day.dataset.date;
    renderCalendar();
  });

  accessKind.addEventListener("change", () => {
    capacityField.hidden = accessKind.value !== "limited";
    if (accessKind.value === "limited" && !capacityInput.value) capacityInput.value = "30";
  });

  saveDay.addEventListener("click", () => {
    const trail = selectedTrail();
    const mode = modeSelect.value;
    const currentBooked = model.bookedUnits(state.bookings, trail.id, mode, selectedDate);
    const kind = accessKind.value;
    const capacity = Number.parseInt(capacityInput.value, 10);
    if (kind === "limited" && (!Number.isFinite(capacity) || capacity < currentBooked)) {
      editorMessage.textContent = `La capienza non può essere inferiore ai ${currentBooked} posti già impegnati.`;
      editorMessage.classList.add("admin-message--error");
      return;
    }
    if (kind !== "limited" && currentBooked > 0) {
      editorMessage.textContent = `La giornata ha ${currentBooked} posti impegnati: prima occorre gestire quelle prenotazioni.`;
      editorMessage.classList.add("admin-message--error");
      return;
    }
    state.calendar[model.accessKey(trail.id, mode, selectedDate)] = {
      kind,
      capacity: kind === "limited" ? capacity : null
    };
    saveState();
    renderCalendar();
    editorMessage.classList.remove("admin-message--error");
    editorMessage.textContent = "Giornata salvata su questo computer.";
  });

  function changeMonth(offset) {
    const next = new Date(viewYear, viewMonth + offset, 1);
    viewYear = next.getFullYear();
    viewMonth = next.getMonth();
    selectedDate = monthDate(1);
    renderAll();
  }

  previousMonth.addEventListener("click", () => changeMonth(-1));
  nextMonth.addEventListener("click", () => changeMonth(1));
  trailSelect.addEventListener("change", renderAll);
  modeSelect.addEventListener("change", renderAll);
  [bookingSearch, bookingStatus, bookingPeriod].forEach((control) => control.addEventListener("input", renderBookings));

  bookingTableBody.addEventListener("click", (event) => {
    const button = event.target.closest(".booking-open-day");
    if (!button) return;
    const item = state.bookings.find((bookingItem) => bookingItem.id === button.dataset.bookingId);
    if (!item) return;
    const [year, month] = item.date.split("-").map(Number);
    viewYear = year;
    viewMonth = month - 1;
    selectedDate = item.date;
    trailSelect.value = item.trailId;
    modeSelect.value = item.mode;
    renderAll();
    document.getElementById("access-calendar").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  resetDemo.addEventListener("click", () => {
    if (!window.confirm("Ripristinare calendario e prenotazioni dimostrative? Le modifiche locali verranno perse.")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    selectedDate = monthDate(17);
    trailSelect.value = FALLBACK_TRAILS[0].id;
    modeSelect.value = "a_piedi";
    bookingSearch.value = "";
    bookingStatus.value = "all";
    bookingPeriod.value = "all";
    renderAll();
  });

  window.addEventListener("sentieri:manager-catalog-updated", (event) => {
    const published = Array.isArray(event.detail?.catalog)
      ? event.detail.catalog.filter((item) => item.publicationStatus === "published" && item.geometryAvailable)
      : [];
    if (!published.length) return;
    trails = published.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      official: item.official
    }));
    populateTrailSelect();
    renderAll();
  });

  populateTrailSelect();
  renderAll();

  fetch("dati-parco/percorsi/catalogo-unificato/catalogo.geojson")
    .then((response) => {
      if (!response.ok) throw new Error("Catalogo non disponibile");
      return response.json();
    })
    .then((catalog) => {
      const loadedTrails = catalog.features
        .map((feature) => feature.properties)
        .filter((properties) => properties?.id && properties?.name)
        .map((properties) => ({
          id: properties.id,
          code: properties.code,
          name: properties.name,
          official: Boolean(properties.official)
        }))
        .sort((first, second) => Number(second.official) - Number(first.official)
          || String(first.code || "ZZZ").localeCompare(String(second.code || "ZZZ"), "it", { numeric: true })
          || first.name.localeCompare(second.name, "it"));
      if (!loadedTrails.length) return;
      trails = loadedTrails;
      populateTrailSelect();
      renderAll();
    })
    .catch(() => {
      // I percorsi principali restano disponibili anche aprendo la demo senza catalogo completo.
    });
})();
