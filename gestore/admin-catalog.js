(function setupManagerTrailCatalog() {
  "use strict";

  const model = window.SentieriManagerCatalogModel;
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

  const search = document.getElementById("manager-trail-search");
  const statusFilter = document.getElementById("manager-trail-status-filter");
  const sourceFilter = document.getElementById("manager-trail-source-filter");
  const visibleCount = document.getElementById("manager-trail-visible-count");
  const emptyState = document.getElementById("manager-trail-empty-state");
  const catalogMessage = document.getElementById("manager-trail-message");
  const publishedCount = document.getElementById("trail-published-count");
  const draftCount = document.getElementById("trail-draft-count");
  const retiredCount = document.getElementById("trail-retired-count");
  const customCount = document.getElementById("trail-custom-count");
  const addButton = document.getElementById("add-manager-trail");
  const resetButton = document.getElementById("reset-trail-catalog-demo");

  const editor = document.getElementById("trail-editor-dialog");
  const editorForm = document.getElementById("trail-editor-form");
  const editorId = document.getElementById("trail-editor-id");
  const editorKicker = document.getElementById("trail-editor-kicker");
  const editorTitle = document.getElementById("trail-editor-title");
  const editorCode = document.getElementById("trail-editor-code");
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogState));
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

  function populateSourceFilter() {
    const selected = sourceFilter.value || "all";
    const sources = [...new Set(effectiveTrails.map((item) => item.source))].sort((a, b) => a.localeCompare(b, "it"));
    sourceFilter.innerHTML = '<option value="all">Tutte le fonti</option>'
      + sources.map((source) => `<option value="${escapeHtml(source)}">${escapeHtml(source)}</option>`).join("");
    sourceFilter.value = sources.includes(selected) ? selected : "all";
  }

  function renderCatalog() {
    effectiveTrails = model.effectiveCatalog(baseTrails, catalogState);
    const stats = model.catalogStats(effectiveTrails);
    publishedCount.textContent = stats.published.toLocaleString("it-IT");
    draftCount.textContent = stats.draft.toLocaleString("it-IT");
    retiredCount.textContent = stats.retired.toLocaleString("it-IT");
    customCount.textContent = stats.custom.toLocaleString("it-IT");
    populateSourceFilter();
    const filtered = model.filterCatalog(effectiveTrails, {
      query: search.value,
      status: statusFilter.value,
      source: sourceFilter.value
    });
    visibleCount.textContent = `${filtered.length.toLocaleString("it-IT")} su ${effectiveTrails.length.toLocaleString("it-IT")}`;
    emptyState.hidden = filtered.length > 0;
    tableBody.innerHTML = filtered.map((item) => {
      const statusAction = item.publicationStatus === "published"
        ? `<button type="button" class="outline trail-row-action trail-row-action--danger" data-action="retire" data-id="${escapeHtml(item.id)}">Ritira dall’app</button>`
        : item.publicationStatus === "retired" && item.geometryAvailable
          ? `<button type="button" class="outline trail-row-action" data-action="publish" data-id="${escapeHtml(item.id)}">Ripubblica</button>`
          : "";
      const geometryLabel = item.geometryAvailable ? "Geometria disponibile" : "Geometria da aggiungere";
      return `
        <tr class="trail-row trail-row--${escapeHtml(item.publicationStatus)}">
          <td><strong>${escapeHtml(item.code || "Senza codice")} · ${escapeHtml(item.name)}</strong><small>${escapeHtml(geometryLabel)}${item.lastReason ? ` · Ultima nota: ${escapeHtml(item.lastReason)}` : ""}</small></td>
          <td><strong>${escapeHtml(DIFFICULTY_LABELS[item.difficulty] || "Non indicata")}</strong><small>${escapeHtml(formatLength(item.lengthMeters))} · ${escapeHtml(formatDuration(item.durationMinutes))}</small></td>
          <td><span class="trail-mode-tags">${modesFor(item).map((mode) => `<i>${escapeHtml(mode)}</i>`).join("")}</span></td>
          <td><strong>${escapeHtml(item.source)}</strong><small>${item.official ? "Fonte PNALM" : item.custom ? "Dato del gestore" : "Fonte esterna"}</small></td>
          <td><span class="trail-publication-status trail-publication-status--${escapeHtml(item.publicationStatus)}">${escapeHtml(STATUS_LABELS[item.publicationStatus])}</span></td>
          <td><div class="trail-row-actions"><button type="button" class="outline trail-row-action" data-action="edit" data-id="${escapeHtml(item.id)}">Modifica</button>${statusAction}</div></td>
        </tr>`;
    }).join("");
    window.dispatchEvent(new CustomEvent("sentieri:manager-catalog-updated", { detail: { catalog: effectiveTrails } }));
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

  function openTrailEditor(item = null) {
    editorForm.reset();
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
    editorSource.textContent = item?.source || "Inserimento manuale gestore";
    editorReasonLabel.textContent = item ? "Motivo della correzione" : "Nota iniziale";
    editorReason.placeholder = item ? "Perché questi dati vengono corretti" : "Perché viene creato questo percorso";
    editorGeometryNote.innerHTML = item?.geometryAvailable
      ? '<strong>Geometria disponibile.</strong> La correzione modifica la scheda ma non riscrive la traccia originale.'
      : '<strong>Geometria mancante.</strong> Il nuovo percorso resterà in bozza finché la linea non sarà disegnata o importata.';
    openDialog(editor);
    editorName.focus();
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
    const publishing = nextStatus === "published";
    statusTitle.textContent = publishing ? "Ripubblica percorso" : "Ritira percorso dall’app";
    statusDescription.textContent = publishing
      ? `${item.code ? `${item.code} · ` : ""}${item.name} tornerà visibile ai visitatori.`
      : `${item.code ? `${item.code} · ` : ""}${item.name} non sarà più mostrato nell’app. Dati, fonte e storico resteranno conservati.`;
    statusReason.placeholder = publishing ? "Perché il percorso torna disponibile" : "Perché il percorso viene ritirato";
    statusConfirm.textContent = publishing ? "Ripubblica" : "Ritira dall’app";
    openDialog(statusDialog);
    statusReason.focus();
  }

  editorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = editorFields();
    if (!editorForm.reportValidity() || model.validateFields(fields).length) {
      editorMessage.textContent = "Controlla nome e valori numerici.";
      return;
    }
    try {
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
      editorMessage.textContent = error.message === "REASON_REQUIRED"
        ? "Inserisci una motivazione."
        : "Impossibile salvare: controlla i dati inseriti.";
    }
  });

  statusForm.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
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
    if (button.dataset.action === "edit") openTrailEditor(item);
    if (button.dataset.action === "retire") openStatusDialog(item, "retired");
    if (button.dataset.action === "publish") openStatusDialog(item, "published");
  });

  addButton.addEventListener("click", () => openTrailEditor());
  closeEditor.addEventListener("click", () => closeDialog(editor));
  cancelEditor.addEventListener("click", () => closeDialog(editor));
  cancelStatus.addEventListener("click", () => closeDialog(statusDialog));
  [search, statusFilter, sourceFilter].forEach((control) => control.addEventListener("input", renderCatalog));

  resetButton.addEventListener("click", () => {
    if (!window.confirm("Azzerare correzioni, ritiri e nuovi percorsi creati in questa demo?")) return;
    catalogState = model.emptyState();
    saveState();
    renderCatalog();
    catalogMessage.textContent = "Catalogo dimostrativo ripristinato.";
  });

  fetch("dati-parco/percorsi/catalogo-unificato/catalogo.geojson")
    .then((response) => {
      if (!response.ok) throw new Error(`Catalogo non disponibile (${response.status})`);
      return response.json();
    })
    .then((catalog) => {
      baseTrails = catalog.features
        .map((feature) => model.normalizeBaseTrail(feature.properties))
        .filter((item) => item.id);
      renderCatalog();
    })
    .catch((error) => {
      tableBody.innerHTML = `<tr><td colspan="6" class="review-error">${escapeHtml(error.message)}. Avvia la console dal server locale.</td></tr>`;
    });
})();
