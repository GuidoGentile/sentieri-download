(function initializeSentieriBranding(global) {
  "use strict";

  const STORAGE_KEY = "sentieri_branding_v1";
  const SCHEMA = "sentieri/tenant-branding/v1";
  const DEFAULT_BRANDING = Object.freeze({
    schema: SCHEMA,
    appName: "Sentieri",
    organizationName: "Parco Nazionale d'Abruzzo, Lazio e Molise",
    colors: Object.freeze({
      background: "#edf8fc",
      surface: "#ffffff",
      surfaceSoft: "#eaf5f5",
      border: "#b8d4db",
      text: "#123d3a",
      mutedText: "#587875",
      primary: "#176b52",
      leaf: "#69b77d",
      sky: "#78c6dc",
      route: "#4aabc5",
      success: "#2f8a5b",
      warning: "#d89b34",
      danger: "#c74848"
    }),
    logo: null,
    updatedAt: null
  });

  const CSS_VARIABLES = Object.freeze({
    background: "--bg",
    surface: "--surface",
    surfaceSoft: "--surface-soft",
    border: "--line",
    text: "--text",
    mutedText: "--muted",
    primary: "--primary",
    leaf: "--leaf",
    sky: "--sky",
    route: "--route",
    success: "--success",
    warning: "--warning",
    danger: "--danger"
  });

  function isHexColor(value) {
    return /^#[0-9a-f]{6}$/i.test(String(value || ""));
  }

  function normalizeLogo(value) {
    if (!value || typeof value !== "object") return null;
    const dataUrl = String(value.dataUrl || "");
    const mimeType = String(value.mimeType || "");
    if (!/^data:image\/(png|jpeg|webp);base64,/i.test(dataUrl)) return null;
    if (!/^image\/(png|jpeg|webp)$/i.test(mimeType)) return null;
    return {
      dataUrl,
      mimeType,
      fileName: String(value.fileName || "logo"),
      size: Number.isFinite(value.size) ? value.size : null
    };
  }

  function normalizeBranding(input) {
    const source = input && typeof input === "object" ? input : {};
    const colors = {};
    Object.keys(DEFAULT_BRANDING.colors).forEach((key) => {
      colors[key] = isHexColor(source.colors?.[key])
        ? source.colors[key].toLowerCase()
        : DEFAULT_BRANDING.colors[key];
    });
    return {
      schema: SCHEMA,
      appName: String(source.appName || DEFAULT_BRANDING.appName).trim().slice(0, 60) || DEFAULT_BRANDING.appName,
      organizationName: String(source.organizationName || DEFAULT_BRANDING.organizationName).trim().slice(0, 120),
      colors,
      logo: normalizeLogo(source.logo),
      updatedAt: source.updatedAt || null
    };
  }

  function load() {
    try {
      const stored = global.localStorage?.getItem(STORAGE_KEY);
      return normalizeBranding(stored ? JSON.parse(stored) : DEFAULT_BRANDING);
    } catch {
      return normalizeBranding(DEFAULT_BRANDING);
    }
  }

  function save(input) {
    const normalized = normalizeBranding({ ...input, updatedAt: new Date().toISOString() });
    global.localStorage?.setItem(STORAGE_KEY, JSON.stringify(normalized));
    apply(normalized);
    global.dispatchEvent?.(new CustomEvent("sentieri:branding-changed", { detail: normalized }));
    return normalized;
  }

  function reset() {
    global.localStorage?.removeItem(STORAGE_KEY);
    const defaults = normalizeBranding(DEFAULT_BRANDING);
    apply(defaults);
    global.dispatchEvent?.(new CustomEvent("sentieri:branding-changed", { detail: defaults }));
    return defaults;
  }

  function apply(input, options = {}) {
    const branding = normalizeBranding(input);
    const root = options.root || document.documentElement;
    Object.entries(CSS_VARIABLES).forEach(([key, cssVariable]) => {
      root.style.setProperty(cssVariable, branding.colors[key]);
    });
    root.style.setProperty("--accent", branding.colors.primary);
    root.style.setProperty("--accent-soft", branding.colors.leaf);

    const scope = options.scope || document;
    scope.querySelectorAll?.("[data-brand-app-name]").forEach((node) => {
      node.textContent = branding.appName;
    });
    scope.querySelectorAll?.("[data-brand-organization-name]").forEach((node) => {
      node.textContent = branding.organizationName;
    });
    scope.querySelectorAll?.(".app-logo").forEach((host) => {
      const previousCustom = host.querySelector("img[data-custom-brand-logo]");
      if (branding.logo) {
        host.dataset.defaultMarkup ||= host.innerHTML;
        host.innerHTML = "";
        const image = document.createElement("img");
        image.src = branding.logo.dataUrl;
        image.alt = `Logo ${branding.appName}`;
        image.dataset.customBrandLogo = "true";
        host.appendChild(image);
      } else if (previousCustom && host.dataset.defaultMarkup) {
        host.innerHTML = host.dataset.defaultMarkup;
      }
      host.setAttribute("aria-label", `Logo ${branding.appName}`);
    });
    return branding;
  }

  const api = { STORAGE_KEY, SCHEMA, DEFAULT_BRANDING, CSS_VARIABLES, normalizeBranding, load, save, reset, apply };
  global.SentieriBranding = api;
  global.addEventListener?.("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    const branding = load();
    apply(branding);
    global.dispatchEvent?.(new CustomEvent("sentieri:branding-changed", { detail: branding }));
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => apply(load()), { once: true });
  } else {
    apply(load());
  }
})(window);
