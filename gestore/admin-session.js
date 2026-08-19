(function setupManagerSession() {
  "use strict";

  const api = window.SentieriSupabase;
  const form = document.getElementById("manager-login-form");
  const email = document.getElementById("manager-login-email");
  const logout = document.getElementById("manager-logout");
  const status = document.getElementById("manager-session-status");
  const message = document.getElementById("manager-login-message");
  if (!api || !form || !email || !logout || !status || !message) return;

  function showMessage(text, error = false) {
    message.textContent = text;
    message.classList.toggle("admin-message--error", error);
  }

  async function renderSession() {
    const session = await api.validSession();
    const signedInEmail = session?.user?.email;
    form.hidden = Boolean(session);
    logout.hidden = !session;
    status.textContent = session
      ? `Collegato come ${signedInEmail || "gestore autenticato"}. Calendario e prenotazioni possono usare i dati online.`
      : "Non collegato. La console mostra ancora i dati dimostrativi locali.";
    document.body.classList.toggle("manager-online", Boolean(session));
    if (session) {
      try {
        await api.claimInitialAccess();
        window.dispatchEvent(new CustomEvent("sentieri:manager-online"));
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
