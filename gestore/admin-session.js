(function setupManagerSession() {
  "use strict";

  const api = window.SentieriSupabase;
  const form = document.getElementById("manager-login-form");
  const email = document.getElementById("manager-login-email");
  const logout = document.getElementById("manager-logout");
  const status = document.getElementById("manager-session-status");
  const title = document.getElementById("manager-session-title");
  const message = document.getElementById("manager-login-message");
  const navigation = document.querySelector(".manager-section-nav");
  const consoleContent = document.querySelector(".manager-folder-content");
  if (!api || !form || !email || !logout || !status || !title || !message || !navigation || !consoleContent) return;

  function showMessage(text, error = false) {
    message.textContent = text;
    message.classList.toggle("admin-message--error", error);
  }

  async function renderSession() {
    const session = await api.validSession();
    const signedInEmail = session?.user?.email;
    form.hidden = Boolean(session);
    logout.hidden = !session;
    navigation.hidden = true;
    consoleContent.hidden = true;
    title.textContent = session ? "Verifica dell’accesso" : "Accedi";
    status.textContent = session
      ? "Controllo delle autorizzazioni in corso…"
      : "Inserisci la tua email personale per ricevere il link di accesso.";
    document.body.classList.remove("manager-online");
    if (session) {
      try {
        const access = await api.currentAccess();
        if (!access.length) throw new Error("Account autenticato ma privo di un ruolo attivo.");
        const superadmin = access.some((item) => item.staff_role === "superadmin");
        const roleLabel = superadmin ? "Superadmin" : access.map((item) => item.staff_role).join(", ");
        title.textContent = "Sessione attiva";
        status.textContent = `${signedInEmail || "Account autenticato"} · ${roleLabel}`;
        navigation.hidden = false;
        consoleContent.hidden = false;
        document.body.classList.add("manager-online");
        showMessage("");
        window.dispatchEvent(new CustomEvent("sentieri:manager-online", { detail: { access, session } }));
      } catch (error) {
        showMessage(error.message || "Account non autorizzato alla gestione.", true);
      }
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("Invio del link sicuro…");
    try {
      await api.sendMagicLink(email.value.trim());
      showMessage("Link inviato. Apri l’email su questo computer e poi torna alla console.");
    } catch (error) {
      showMessage(error.message || "Invio non riuscito.", true);
    }
  });

  logout.addEventListener("click", () => {
    api.logout();
    showMessage("");
    renderSession();
  });

  window.addEventListener("sentieri:supabase-session-changed", renderSession);
  renderSession();
})();
