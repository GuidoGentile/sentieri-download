(function setupManagerSession() {
  "use strict";

  const api = window.SentieriSupabase;
  const form = document.getElementById("manager-login-form");
  const email = document.getElementById("manager-login-email");
  const password = document.getElementById("manager-login-password");
  const firstAccess = document.getElementById("manager-first-access");
  const forgotPassword = document.getElementById("manager-forgot-password");
  const passwordForm = document.getElementById("manager-password-form");
  const newPassword = document.getElementById("manager-new-password");
  const confirmPassword = document.getElementById("manager-confirm-password");
  const logout = document.getElementById("manager-logout");
  const status = document.getElementById("manager-session-status");
  const title = document.getElementById("manager-session-title");
  const message = document.getElementById("manager-login-message");
  const navigation = document.querySelector(".manager-section-nav");
  const consoleContent = document.querySelector(".manager-folder-content");
  if (!api || !form || !email || !password || !firstAccess || !forgotPassword || !passwordForm ||
      !newPassword || !confirmPassword || !logout || !status || !title || !message || !navigation || !consoleContent) return;

  function showMessage(text, error = false) {
    message.textContent = text;
    message.classList.toggle("admin-message--error", error);
  }

  function readableError(error, fallback, { firstAccess = false } = {}) {
    const source = String(error?.message || "").toLowerCase();
    if (source.includes("invalid login credentials")) return "Email o password non corrette.";
    if (source.includes("email not confirmed")) return "Conferma una sola volta l’indirizzo dall’email ricevuta, poi accedi con la password.";
    if (source.includes("user already registered") || source.includes("already been registered")) {
      return "L’account esiste già. Usa Accedi oppure Password dimenticata.";
    }
    if (source.includes("password") && source.includes("least")) return "Scegli una password di almeno 8 caratteri.";
    if (!navigator.onLine || source.includes("failed to fetch") || source.includes("network")) {
      if (firstAccess) return "Per il primo accesso serve internet. Controlla la connessione e riprova.";
      return "Nessuna connessione. La sessione già memorizzata non viene cancellata.";
    }
    return error?.message || fallback;
  }

  function setSignedOutControls() {
    form.hidden = false;
    firstAccess.hidden = false;
    forgotPassword.hidden = false;
    passwordForm.hidden = true;
    logout.hidden = true;
  }

  async function renderSession() {
    const session = await api.validSession();
    const signedInEmail = session?.user?.email;
    navigation.hidden = true;
    consoleContent.hidden = true;
    document.body.classList.remove("manager-online");

    if (!session) {
      setSignedOutControls();
      title.textContent = "Accedi";
      status.textContent = "Email personale e password.";
      return;
    }

    form.hidden = true;
    firstAccess.hidden = true;
    forgotPassword.hidden = true;
    logout.hidden = false;

    if (session.recovery) {
      passwordForm.hidden = false;
      title.textContent = "Nuova password";
      status.textContent = signedInEmail || "Account verificato";
      showMessage("");
      return;
    }

    passwordForm.hidden = true;
    if (session.refreshPending) {
      title.textContent = "Sessione ricordata";
      status.textContent = `${signedInEmail || "Account autenticato"} · riconnettiti per aggiornare i dati`;
      showMessage("La sessione resta memorizzata su questo dispositivo.");
      return;
    }

    title.textContent = "Verifica dell’accesso";
    status.textContent = "Controllo delle autorizzazioni in corso…";
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
      if (!navigator.onLine || String(error?.message || "").includes("Sessione ricordata")) {
        title.textContent = "Sessione ricordata";
        status.textContent = `${signedInEmail || "Account autenticato"} · dati online non disponibili`;
      }
      showMessage(readableError(error, "Account non autorizzato alla gestione."), true);
    }
  }

  function validPasswordFields() {
    if (!form.reportValidity()) return false;
    if (password.value.length < 8) {
      showMessage("Scegli una password di almeno 8 caratteri.", true);
      password.focus();
      return false;
    }
    return true;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("Accesso in corso…");
    try {
      await api.signInWithPassword(email.value.trim(), password.value);
      password.value = "";
      await renderSession();
    } catch (error) {
      showMessage(readableError(error, "Accesso non riuscito."), true);
    }
  });

  firstAccess.addEventListener("click", async () => {
    if (!validPasswordFields()) return;
    showMessage("Creazione dell’account…");
    try {
      const result = await api.createPasswordAccount(email.value.trim(), password.value);
      password.value = "";
      if (result.confirmationRequired) {
        showMessage("Account creato. Conferma una sola volta l’indirizzo dall’email ricevuta, poi usa la password.");
      } else {
        await renderSession();
      }
    } catch (error) {
      showMessage(readableError(error, "Creazione dell’account non riuscita.", { firstAccess: true }), true);
    }
  });

  forgotPassword.addEventListener("click", async () => {
    if (!email.reportValidity()) return;
    showMessage("Invio del recupero…");
    try {
      await api.sendPasswordRecovery(email.value.trim());
      showMessage("Email inviata. Il collegamento serve soltanto a scegliere una nuova password.");
    } catch (error) {
      showMessage(readableError(error, "Invio non riuscito."), true);
    }
  });

  passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (newPassword.value !== confirmPassword.value) {
      showMessage("Le due password non coincidono.", true);
      confirmPassword.focus();
      return;
    }
    showMessage("Salvataggio della password…");
    try {
      await api.updatePassword(newPassword.value);
      newPassword.value = "";
      confirmPassword.value = "";
      await renderSession();
    } catch (error) {
      showMessage(readableError(error, "Salvataggio non riuscito."), true);
    }
  });

  logout.addEventListener("click", () => {
    api.logout();
    showMessage("");
    renderSession();
  });

  window.addEventListener("online", renderSession);
  window.addEventListener("sentieri:supabase-session-changed", renderSession);
  renderSession();
})();
