(function setupBrandingManager() {
  "use strict";

  const brandingApi = window.SentieriBranding;
  const mapApi = window.SentieriMapConfiguration;
  if (!brandingApi || !mapApi) return;

  const COLOR_FIELDS = [
    ["background", "Sfondo cielo", "Sfondo generale delle schermate"],
    ["surface", "Superficie", "Card, pannelli e modali"],
    ["surfaceSoft", "Superficie secondaria", "Filtri, campi e aree leggere"],
    ["border", "Bordi", "Separazioni e contorni dei controlli"],
    ["text", "Testo principale", "Titoli e contenuti ad alto contrasto"],
    ["mutedText", "Testo secondario", "Note, metadati e descrizioni"],
    ["primary", "Verde bosco", "Pulsanti principali e struttura"],
    ["leaf", "Verde foglia", "Vegetazione e superfici naturali"],
    ["sky", "Azzurro cielo", "Accento luminoso dell’identità"],
    ["route", "Percorso evidenziato", "Traccia selezionata sulla mappa"],
    ["success", "Disponibile", "Conferme e stati positivi"],
    ["warning", "Attenzione", "Avvisi che richiedono cautela"],
    ["danger", "Pericolo o chiusura", "Errori, divieti e indisponibilità"]
  ];

  const form = document.getElementById("branding-form");
  const grid = document.getElementById("branding-color-grid");
  const appName = document.getElementById("branding-app-name");
  const organizationName = document.getElementById("branding-organization-name");
  const logoInput = document.getElementById("branding-logo-file");
  const logoPreview = document.getElementById("branding-logo-preview");
  const logoNote = document.getElementById("branding-logo-note");
  const removeLogo = document.getElementById("branding-remove-logo");
  const resetButton = document.getElementById("branding-reset");
  const exportButton = document.getElementById("branding-export");
  const importInput = document.getElementById("branding-import");
  const message = document.getElementById("branding-message");
  const preview = document.getElementById("branding-preview");
  const previewLogo = document.getElementById("preview-logo");
  const previewAppName = document.getElementById("preview-app-name");
  const previewOrganizationName = document.getElementById("preview-organization-name");
  const contrastCheck = document.getElementById("branding-contrast");
  const mapCenterName = document.getElementById("map-center-name");
  const mapCenterLongitude = document.getElementById("map-center-longitude");
  const mapCenterLatitude = document.getElementById("map-center-latitude");
  const mapDetailSide = document.getElementById("map-detail-side");
  const mapContextSide = document.getElementById("map-context-side");
  const mapDetailSquare = document.getElementById("map-detail-square");
  const mapDetailLabel = document.getElementById("map-detail-label");
  const mapContextLabel = document.getElementById("map-context-label");
  const mapCoverageDescription = document.getElementById("map-coverage-description");
  const mapValidationMessage = document.getElementById("map-validation-message");
  let draft = brandingApi.load();
  let mapDraft = mapApi.load();

  function createColorControls() {
    grid.innerHTML = COLOR_FIELDS.map(([key, label, description]) => `
      <div class="color-control" data-color-key="${key}">
        <input id="branding-color-${key}" type="color" aria-label="${label}" />
        <div class="color-control__body">
          <label for="branding-hex-${key}">${label}</label>
          <input id="branding-hex-${key}" type="text" maxlength="7" spellcheck="false" aria-label="Valore esadecimale ${label}" />
          <small>${description}</small>
        </div>
      </div>
    `).join("");

    COLOR_FIELDS.forEach(([key]) => {
      const colorInput = document.getElementById(`branding-color-${key}`);
      const hexInput = document.getElementById(`branding-hex-${key}`);
      colorInput.addEventListener("input", () => {
        hexInput.value = colorInput.value.toUpperCase();
        updateDraftColor(key, colorInput.value);
      });
      hexInput.addEventListener("input", () => {
        const value = hexInput.value.trim();
        if (/^#[0-9a-f]{6}$/i.test(value)) {
          colorInput.value = value;
          updateDraftColor(key, value);
          hexInput.setCustomValidity("");
        } else {
          hexInput.setCustomValidity("Inserisci un colore nel formato #RRGGBB");
        }
      });
    });
  }

  function updateDraftColor(key, value) {
    draft = brandingApi.normalizeBranding({ ...draft, colors: { ...draft.colors, [key]: value } });
    renderPreview();
  }

  function setLogoContent(host, logo, fallbackLetter) {
    host.innerHTML = "";
    if (logo) {
      const image = document.createElement("img");
      image.src = logo.dataUrl;
      image.alt = "Anteprima logo";
      host.appendChild(image);
    } else if (host.dataset.defaultLogoSrc) {
      const image = document.createElement("img");
      image.src = host.dataset.defaultLogoSrc;
      image.alt = "Logo predefinito Sentieri d’Abruzzo";
      host.appendChild(image);
    } else {
      const fallback = document.createElement("span");
      if (host === previewLogo) {
        fallback.className = "provisional-logo-mark";
        fallback.setAttribute("aria-hidden", "true");
      } else {
        fallback.textContent = fallbackLetter;
      }
      host.appendChild(fallback);
    }
  }

  function renderForm() {
    appName.value = draft.appName;
    organizationName.value = draft.organizationName;
    COLOR_FIELDS.forEach(([key]) => {
      document.getElementById(`branding-color-${key}`).value = draft.colors[key];
      document.getElementById(`branding-hex-${key}`).value = draft.colors[key].toUpperCase();
    });
    setLogoContent(logoPreview, draft.logo, draft.appName.charAt(0).toUpperCase() || "S");
    logoNote.textContent = draft.logo
      ? `${draft.logo.fileName}${draft.logo.size ? ` · ${Math.ceil(draft.logo.size / 1024)} KB` : ""}`
      : "Logo predefinito Sentieri.";
    mapCenterName.value = mapDraft.center.name;
    mapCenterLongitude.value = mapDraft.center.longitude;
    mapCenterLatitude.value = mapDraft.center.latitude;
    mapDetailSide.value = mapDraft.detailSideKilometers;
    mapContextSide.value = mapDraft.contextSideKilometers;
    renderPreview();
    renderMapPreview();
  }

  function readMapDraft() {
    mapDraft = {
      ...mapDraft,
      center: {
        name: mapCenterName.value,
        longitude: Number(mapCenterLongitude.value),
        latitude: Number(mapCenterLatitude.value)
      },
      detailSideKilometers: Number(mapDetailSide.value),
      contextSideKilometers: Number(mapContextSide.value)
    };
    renderMapPreview();
  }

  function mapConfigurationIsValid() {
    const detail = Number(mapDetailSide.value);
    const context = Number(mapContextSide.value);
    const valid = Number.isFinite(detail) && Number.isFinite(context) && context >= detail;
    mapContextSide.setCustomValidity(valid ? "" : "Il lato del contesto deve essere almeno uguale al dettaglio.");
    mapValidationMessage.textContent = valid ? "" : "Il contesto non può essere più piccolo del dettaglio.";
    return valid;
  }

  function renderMapPreview() {
    const detail = Math.max(1, Number(mapDetailSide.value) || mapDraft.detailSideKilometers);
    const context = Math.max(1, Number(mapContextSide.value) || mapDraft.contextSideKilometers);
    const ratio = Math.max(0.08, Math.min(1, detail / context));
    mapDetailSquare.style.width = `${ratio * 100}%`;
    mapDetailLabel.textContent = `Dettaglio · ${detail.toLocaleString("it-IT")} km`;
    mapContextLabel.textContent = `Contesto · ${context.toLocaleString("it-IT")} km`;
    const longitude = Number(mapCenterLongitude.value);
    const latitude = Number(mapCenterLatitude.value);
    mapCoverageDescription.textContent = `${mapCenterName.value || "Centro"} · ${longitude.toLocaleString("it-IT", { minimumFractionDigits: 6, maximumFractionDigits: 6 })}; ${latitude.toLocaleString("it-IT", { minimumFractionDigits: 6, maximumFractionDigits: 6 })}`;
    mapConfigurationIsValid();
  }

  function renderPreview() {
    const { colors } = draft;
    const variables = {
      "--preview-background": colors.background,
      "--preview-surface": colors.surface,
      "--preview-border": colors.border,
      "--preview-text": colors.text,
      "--preview-muted": colors.mutedText,
      "--preview-primary": colors.primary,
      "--preview-leaf": colors.leaf,
      "--preview-sky": colors.sky,
      "--preview-route": colors.route,
      "--preview-success": colors.success,
      "--preview-warning": colors.warning,
      "--preview-danger": colors.danger
    };
    Object.entries(variables).forEach(([key, value]) => preview.style.setProperty(key, value));
    previewAppName.textContent = draft.appName;
    previewOrganizationName.textContent = draft.organizationName;
    setLogoContent(previewLogo, draft.logo, draft.appName.charAt(0).toUpperCase() || "S");
    renderContrastCheck();
  }

  function relativeLuminance(hex) {
    const rgb = hex.slice(1).match(/.{2}/g).map((part) => Number.parseInt(part, 16) / 255);
    const linear = rgb.map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }

  function contrastRatio(first, second) {
    const high = Math.max(relativeLuminance(first), relativeLuminance(second));
    const low = Math.min(relativeLuminance(first), relativeLuminance(second));
    return (high + 0.05) / (low + 0.05);
  }

  function renderContrastCheck() {
    const textRatio = contrastRatio(draft.colors.text, draft.colors.background);
    const buttonRatio = contrastRatio("#ffffff", draft.colors.primary);
    const textPasses = textRatio >= 4.5;
    const buttonPasses = buttonRatio >= 4.5;
    contrastCheck.innerHTML = `
      <strong>Controllo leggibilità</strong><br />
      Testo su sfondo: ${textRatio.toFixed(1)}:1 ${textPasses ? "✓" : '<span class="contrast-warning">da correggere</span>'}<br />
      Bianco sul pulsante: ${buttonRatio.toFixed(1)}:1 ${buttonPasses ? "✓" : '<span class="contrast-warning">da correggere</span>'}
    `;
  }

  function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? draft.colors.danger : draft.colors.primary;
  }

  function loadLogo(file) {
    const allowed = new Set(["image/png", "image/jpeg", "image/webp"]);
    if (!allowed.has(file.type)) throw new Error("Usa un file PNG, JPG o WebP.");
    if (file.size > 512 * 1024) throw new Error("Il logo supera 512 KB. Riducilo prima di caricarlo.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Impossibile leggere il logo."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("Il file non è un’immagine valida."));
        image.onload = () => {
          if (image.width > 1024 || image.height > 1024) {
            reject(new Error("Il logo deve essere al massimo 1024 × 1024 pixel."));
            return;
          }
          resolve({ dataUrl: reader.result, mimeType: file.type, fileName: file.name, size: file.size });
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  appName.addEventListener("input", () => {
    draft = brandingApi.normalizeBranding({ ...draft, appName: appName.value });
    renderPreview();
  });

  organizationName.addEventListener("input", () => {
    draft = brandingApi.normalizeBranding({ ...draft, organizationName: organizationName.value });
    renderPreview();
  });

  [mapCenterName, mapCenterLongitude, mapCenterLatitude, mapDetailSide, mapContextSide]
    .forEach((control) => control.addEventListener("input", readMapDraft));

  logoInput.addEventListener("change", async () => {
    const file = logoInput.files?.[0];
    if (!file) return;
    try {
      draft = brandingApi.normalizeBranding({ ...draft, logo: await loadLogo(file) });
      renderForm();
      showMessage("Logo pronto nell’anteprima. Premi Salva configurazione per confermare.");
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      logoInput.value = "";
    }
  });

  removeLogo.addEventListener("click", () => {
    draft = brandingApi.normalizeBranding({ ...draft, logo: null });
    renderForm();
    showMessage("Logo predefinito ripristinato nell’anteprima.");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!mapConfigurationIsValid() || !form.reportValidity()) return;
    draft = brandingApi.save(draft);
    mapDraft = mapApi.save(mapDraft);
    renderForm();
    showMessage("Configurazione dell’ente salvata. Cartografia e identità sono aggiornate.");
  });

  resetButton.addEventListener("click", () => {
    if (!window.confirm("Ripristinare cartografia, colori e logo predefiniti?")) return;
    draft = brandingApi.reset();
    mapDraft = mapApi.reset();
    renderForm();
    showMessage("Configurazione predefinita ripristinata.");
  });

  exportButton.addEventListener("click", () => {
    const exported = {
      schema: "sentieri/tenant-configuration/v1",
      branding: draft,
      map: mapDraft
    };
    const blob = new Blob([`${JSON.stringify(exported, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sentieri-configurazione-ente.json";
    link.click();
    URL.revokeObjectURL(url);
    showMessage("Configurazione esportata.");
  });

  importInput.addEventListener("change", async () => {
    const file = importInput.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error("Il file di configurazione è troppo grande.");
      const imported = JSON.parse(await file.text());
      if (imported.schema === "sentieri/tenant-configuration/v1") {
        draft = brandingApi.normalizeBranding(imported.branding);
        mapDraft = mapApi.normalizeMap(imported.map);
      } else if (imported.schema === brandingApi.SCHEMA) {
        draft = brandingApi.normalizeBranding(imported);
      } else if (imported.schema === mapApi.SCHEMA) {
        mapDraft = mapApi.normalizeMap(imported);
      } else {
        throw new Error("Schema della configurazione non riconosciuto.");
      }
      renderForm();
      showMessage("Configurazione importata nell’anteprima. Premi Salva per confermare.");
    } catch (error) {
      showMessage(error.message || "Configurazione non valida.", true);
    } finally {
      importInput.value = "";
    }
  });

  createColorControls();
  renderForm();
})();

(function setupManagerSectionTabs() {
  "use strict";

  const items = [...document.querySelectorAll(".manager-section-nav__item")];
  const panes = [...document.querySelectorAll("[data-manager-pane]")];
  const hashAliases = { "#manager-bookings": "#access-calendar" };
  if (!items.length || !panes.length) return;

  function selectItem(item) {
    const selectedTab = item.dataset.managerTab;

    items.forEach((candidate) => {
      const selected = candidate === item;
      candidate.classList.toggle("manager-section-nav__item--active", selected);
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });

    panes.forEach((pane) => {
      pane.hidden = pane.dataset.managerPane !== selectedTab;
    });
  }

  function selectFromHash() {
    const hash = hashAliases[window.location.hash] || window.location.hash;
    const matchingItem = hash && items.find((item) => item.hash === hash);
    selectItem(matchingItem || items[0]);
  }

  items.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      if (window.location.hash !== item.hash) {
        window.history.pushState(null, "", item.hash);
      }
      selectItem(item);
    });

    item.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextItem = items[(index + direction + items.length) % items.length];
      nextItem.click();
      nextItem.focus();
    });
  });
  window.addEventListener("hashchange", selectFromHash);
  window.addEventListener("popstate", selectFromHash);
  selectFromHash();
})();

(function setupTrailGovernance() {
  "use strict";

  const STORAGE_KEY = "sentieri.trail-link-decisions.v1";
  const list = document.getElementById("governance-review-list");
  const message = document.getElementById("governance-message");
  if (!list || !message) return;

  const relationshipLabels = {
    "supporting-source": "Stesso sentiero",
    "variant-candidate": "Possibile variante",
    "review-required": "Da confrontare"
  };
  const recommendationLabels = {
    "same-trail": "unire come seconda fonte",
    variant: "conservare come variante",
    separate: "tenere come percorso distinto",
    "manual-review": "confrontare le tracce sulla mappa"
  };

  let catalog = null;
  let currentTrail = null;
  let decisions = loadDecisions();

  function loadDecisions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function percentage(value) {
    return Number.isFinite(value) ? `${Math.round(value * 100)}%` : "non disponibile";
  }

  function renderList() {
    if (!currentTrail) return;
    if (!catalog) {
      message.textContent = "";
      list.innerHTML = '<p class="muted">Caricamento in corso…</p>';
      return;
    }
    const entries = catalog.reviewQueue.filter((item) => item.canonicalTrailId === currentTrail.id);
    message.textContent = entries.length ? `${entries.length} ${entries.length === 1 ? "confronto collegato" : "confronti collegati"}.` : "";
    list.innerHTML = entries.length ? entries.map((item) => {
      const saved = decisions[item.canonicalTrailId] || {};
      const chosenDecision = saved.decision || "not-reviewed";
      const metrics = item.metrics;
      return `
        <details class="review-item" data-trail-id="${escapeHtml(item.canonicalTrailId)}">
          <summary>
            <span class="review-title">
              <strong>${escapeHtml(item.code)} · ${escapeHtml(item.canonicalName)}</strong>
              <small>CAI: ${escapeHtml(item.observedName || "nome non indicato")}</small>
            </span>
            <span class="relationship-badge relationship-badge--${escapeHtml(item.automaticRelationship)}">
              ${escapeHtml(relationshipLabels[item.automaticRelationship])}
            </span>
          </summary>
          <div class="review-body">
            <div class="review-comparison">
              <div><small>Copertura PNALM entro 50 m</small><strong>${percentage(metrics.primaryCoverageWithin50m)}</strong></div>
              <div><small>Copertura CAI entro 50 m</small><strong>${percentage(metrics.observedCoverageWithin50m)}</strong></div>
            </div>
            <p class="review-recommendation">Suggerimento automatico: <strong>${escapeHtml(recommendationLabels[item.recommendedDecision])}</strong>. Il suggerimento non vale come validazione.</p>
            <div class="review-decision">
              <label>Decisione del gestore
                <select class="review-decision-select">
                  <option value="not-reviewed" ${chosenDecision === "not-reviewed" ? "selected" : ""}>Da esaminare</option>
                  <option value="same-trail" ${chosenDecision === "same-trail" ? "selected" : ""}>È lo stesso sentiero</option>
                  <option value="variant" ${chosenDecision === "variant" ? "selected" : ""}>È una variante</option>
                  <option value="separate" ${chosenDecision === "separate" ? "selected" : ""}>Sono percorsi distinti</option>
                </select>
              </label>
              <label>Motivazione
                <input class="review-reason" maxlength="300" value="${escapeHtml(saved.reason || "")}" placeholder="Perché viene presa questa decisione" />
              </label>
              <button type="button" class="primary review-save">Conferma</button>
            </div>
            <p class="review-error" aria-live="polite"></p>
          </div>
        </details>`;
    }).join("") : '<p class="muted">Nessun confronto in questa categoria.</p>';
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest(".review-save");
    if (!button) return;
    const item = button.closest(".review-item");
    const trailId = item.dataset.trailId;
    const decision = item.querySelector(".review-decision-select").value;
    const reason = item.querySelector(".review-reason").value.trim();
    const error = item.querySelector(".review-error");
    if (decision !== "not-reviewed" && !reason) {
      error.textContent = "Inserisci una motivazione prima di confermare.";
      return;
    }
    if (decision === "not-reviewed") delete decisions[trailId];
    else decisions[trailId] = { decision, reason, decidedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
    error.textContent = "Decisione salvata localmente.";
  });

  window.addEventListener("sentieri:manager-trail-detail-opened", (event) => {
    currentTrail = event.detail?.trail || null;
    renderList();
  });

  fetch("dati-parco/percorsi/governance/catalogo-governance.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Catalogo non disponibile (${response.status})`);
      return response.json();
    })
    .then((data) => {
      catalog = data;
      renderList();
    })
    .catch((error) => {
      message.textContent = error.message || "Confronti non disponibili.";
      message.classList.add("admin-message--error");
      list.innerHTML = '<p class="muted">Confronti non disponibili.</p>';
    });
})();
