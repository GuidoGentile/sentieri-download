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
  const sessionPanel = document.querySelector(".manager-session-panel");
  const account = document.getElementById("manager-account");
  const accountToggle = document.getElementById("manager-account-toggle");
  const accountMenu = document.getElementById("manager-account-menu");
  const accountAvatar = document.getElementById("manager-account-avatar");
  const accountEmail = document.getElementById("manager-account-email");
  const accountRole = document.getElementById("manager-account-role");
  const status = document.getElementById("manager-session-status");
  const title = document.getElementById("manager-session-title");
  const message = document.getElementById("manager-login-message");
  const navigation = document.querySelector(".manager-section-nav");
  const consoleContent = document.querySelector(".manager-folder-content");
  if (!api || !form || !email || !password || !firstAccess || !forgotPassword || !passwordForm ||
      !newPassword || !confirmPassword || !logout || !sessionPanel || !account || !accountToggle ||
      !accountMenu || !accountAvatar || !accountEmail || !accountRole || !status || !title ||
      !message || !navigation || !consoleContent) return;

  function closeAccountMenu() {
    accountMenu.hidden = true;
    accountToggle.setAttribute("aria-expanded", "false");
  }

  function hideAccount() {
    closeAccountMenu();
    account.hidden = true;
  }

  function showAccount(signedInEmail, roleLabel = "Account autenticato") {
    const label = signedInEmail || "Account autenticato";
    accountEmail.textContent = label;
    accountRole.textContent = roleLabel;
    accountAvatar.textContent = label.trim().charAt(0).toUpperCase() || "A";
    account.hidden = false;
  }

  function showMessage(text, error = false) {
    message.textContent = text;
    message.classList.toggle("admin-message--error", error);
  }

  function showStatus(text = "") {
    status.textContent = text;
    status.hidden = !text;
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
      if (firstAccess) return "Per registrarti serve internet. Controlla la connessione e riprova.";
      return "Nessuna connessione. La sessione già memorizzata non viene cancellata.";
    }
    return error?.message || fallback;
  }

  function setSignedOutControls() {
    sessionPanel.hidden = false;
    hideAccount();
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
      title.textContent = "Login";
      showStatus();
      showMessage("");
      return;
    }

    form.hidden = true;
    firstAccess.hidden = true;
    forgotPassword.hidden = true;
    logout.hidden = false;
    passwordForm.hidden = true;
    sessionPanel.hidden = true;
    showAccount(signedInEmail, "Verifica dell’accesso…");

    if (session.recovery) {
      sessionPanel.hidden = false;
      passwordForm.hidden = false;
      title.textContent = "Nuova password";
      showStatus(signedInEmail || "Account verificato");
      showAccount(signedInEmail, "Recupero password");
      showMessage("");
      return;
    }

    if (session.refreshPending) {
      showAccount(signedInEmail, "Sessione memorizzata · dati online non disponibili");
      return;
    }

    try {
      const access = await api.currentAccess();
      if (!access.length) throw new Error("Account autenticato ma privo di un ruolo attivo.");
      const superadmin = access.some((item) => item.staff_role === "superadmin");
      const roleLabel = superadmin ? "Superadmin" : access.map((item) => item.staff_role).join(", ");
      showAccount(signedInEmail, roleLabel);
      navigation.hidden = false;
      consoleContent.hidden = false;
      document.body.classList.add("manager-online");
      showMessage("");
      window.dispatchEvent(new CustomEvent("sentieri:manager-online", { detail: { access, session } }));
    } catch (error) {
      if (!navigator.onLine || String(error?.message || "").includes("Sessione ricordata")) {
        sessionPanel.hidden = true;
        showAccount(signedInEmail, "Sessione memorizzata · dati online non disponibili");
        return;
      }
      sessionPanel.hidden = false;
      title.textContent = "Accesso non autorizzato";
      showStatus(signedInEmail || "Account autenticato");
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
        showMessage("Se l’indirizzo è nuovo, riceverai l’email di conferma. Se eri già registrato, premi Accedi: non viene inviata un’altra email.");
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
    closeAccountMenu();
    api.logout();
    showMessage("");
    renderSession();
  });

  accountToggle.addEventListener("click", () => {
    const open = accountMenu.hidden;
    accountMenu.hidden = !open;
    accountToggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (event) => {
    if (!account.contains(event.target)) closeAccountMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAccountMenu();
  });

  window.addEventListener("online", renderSession);
  window.addEventListener("sentieri:supabase-session-changed", renderSession);
  renderSession();
})();
