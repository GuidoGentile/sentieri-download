(function setupManagerSession() {
  "use strict";

  const api = window.SentieriSupabase;
  const form = document.getElementById("manager-login-form");
  const email = document.getElementById("manager-login-email");
  const password = document.getElementById("manager-login-password");
  const socialLogin = document.getElementById("manager-social-login");
  const googleLogin = document.getElementById("manager-login-google");
  const facebookLogin = document.getElementById("manager-login-facebook");
  const appleLogin = document.getElementById("manager-login-apple");
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
  const accountLink = document.getElementById("manager-account-link");
  const profileForm = document.getElementById("manager-profile-form");
  const profileBack = document.getElementById("manager-account-back");
  const profileAvatar = document.getElementById("manager-profile-avatar");
  const profilePhoto = document.getElementById("manager-profile-photo");
  const profileCamera = document.getElementById("manager-profile-camera");
  const profileCameraPanel = document.getElementById("manager-profile-camera-panel");
  const profileCameraVideo = document.getElementById("manager-profile-camera-video");
  const profileCameraCanvas = document.getElementById("manager-profile-camera-canvas");
  const profileCameraCapture = document.getElementById("manager-profile-camera-capture");
  const profileCameraClose = document.getElementById("manager-profile-camera-close");
  const profileCameraMessage = document.getElementById("manager-profile-camera-message");
  const profileName = document.getElementById("manager-profile-name");
  const profileEmail = document.getElementById("manager-profile-email");
  const profileRole = document.getElementById("manager-profile-role");
  const profileMessage = document.getElementById("manager-profile-message");
  const status = document.getElementById("manager-session-status");
  const title = document.getElementById("manager-session-title");
  const message = document.getElementById("manager-login-message");
  const navigation = document.querySelector(".manager-section-nav");
  const consoleContent = document.querySelector(".manager-folder-content");
  if (!api || !form || !email || !password || !socialLogin || !googleLogin || !facebookLogin || !appleLogin ||
      !firstAccess || !forgotPassword || !passwordForm ||
      !newPassword || !confirmPassword || !logout || !sessionPanel || !account || !accountToggle ||
      !accountMenu || !accountAvatar || !accountEmail || !accountRole || !accountLink || !profileForm ||
      !profileBack || !profileAvatar || !profilePhoto || !profileCamera || !profileCameraPanel ||
      !profileCameraVideo || !profileCameraCanvas || !profileCameraCapture || !profileCameraClose ||
      !profileCameraMessage || !profileName || !profileEmail || !profileRole ||
      !profileMessage || !status || !title ||
      !message || !navigation || !consoleContent) return;

  let activeSession = null;
  let activeRoleLabel = "Account autenticato";
  let activeAvatarUrl = "";
  let pendingProfilePhoto = null;
  let profilePreviewUrl = "";
  let profileCameraStream = null;

  function releaseProfilePreview() {
    if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl);
    profilePreviewUrl = "";
  }

  function previewProfilePhoto(file) {
    releaseProfilePreview();
    if (!file) {
      renderProfile();
      return;
    }
    profilePreviewUrl = URL.createObjectURL(file);
    profileAvatar.style.backgroundImage = "url(" + JSON.stringify(profilePreviewUrl) + ")";
    profileAvatar.textContent = "";
  }

  function stopProfileCamera() {
    profileCameraStream?.getTracks().forEach((track) => track.stop());
    profileCameraStream = null;
    profileCameraVideo.srcObject = null;
    profileCameraPanel.hidden = true;
    profileCameraMessage.textContent = "";
  }

  async function renderSocialProviders() {
    try {
      const settings = await api.authSettings();
      googleLogin.hidden = !settings?.external?.google;
      facebookLogin.hidden = !settings?.external?.facebook;
      appleLogin.hidden = !settings?.external?.apple;
      socialLogin.hidden = googleLogin.hidden && facebookLogin.hidden && appleLogin.hidden;
    } catch {
      socialLogin.hidden = true;
    }
  }

  function safeAvatarUrl(value) {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function renderAvatar(element, label, avatarUrl) {
    const url = safeAvatarUrl(avatarUrl);
    element.style.backgroundImage = url ? `url(${JSON.stringify(url)})` : "";
    element.textContent = url ? "" : (label.trim().charAt(0).toUpperCase() || "A");
  }

  function renderProfile() {
    const user = activeSession?.user || {};
    const metadata = user.user_metadata || {};
    const label = user.email || "Account autenticato";
    profileName.value = metadata.full_name || metadata.name || "";
    profileEmail.value = user.email || "";
    profileRole.value = activeRoleLabel;
    renderAvatar(profileAvatar, label, activeAvatarUrl || metadata.avatar_url || metadata.picture || "");
  }

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
    const metadata = activeSession?.user?.user_metadata || {};
    renderAvatar(accountAvatar, label, activeAvatarUrl || metadata.avatar_url || metadata.picture || "");
    renderProfile();
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
    activeSession = session;
    activeRoleLabel = "Account autenticato";
    const signedInEmail = session?.user?.email;
    const metadata = session?.user?.user_metadata || {};
    activeAvatarUrl = metadata.avatar_url || metadata.picture || "";
    if (session && !session.refreshPending) {
      try { activeAvatarUrl = await api.profileAvatarUrl(session.user) || activeAvatarUrl; } catch { /* L’avatar non blocca l’accesso. */ }
    }
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
      activeRoleLabel = "Recupero password";
      showAccount(signedInEmail, activeRoleLabel);
      showMessage("");
      return;
    }

    if (session.refreshPending) {
      activeRoleLabel = "Sessione memorizzata · dati online non disponibili";
      showAccount(signedInEmail, activeRoleLabel);
      return;
    }

    try {
      const access = await api.currentAccess();
      if (!access.length) throw new Error("Account autenticato ma privo di un ruolo attivo.");
      const superadmin = access.some((item) => item.staff_role === "superadmin");
      const roleLabel = superadmin ? "Superadmin" : access.map((item) => item.staff_role).join(", ");
      activeRoleLabel = roleLabel;
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

  googleLogin.addEventListener("click", () => api.signInWithSocial("google"));
  facebookLogin.addEventListener("click", () => api.signInWithSocial("facebook"));
  appleLogin.addEventListener("click", () => api.signInWithSocial("apple"));

  document.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const input = document.getElementById(toggle.dataset.passwordToggle);
      if (!input) return;
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      toggle.textContent = visible ? "Mostra" : "Nascondi";
      toggle.setAttribute("aria-label", visible ? "Mostra password" : "Nascondi password");
      toggle.setAttribute("aria-pressed", String(!visible));
    });
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

  accountLink.addEventListener("click", () => {
    closeAccountMenu();
    window.dispatchEvent(new CustomEvent("sentieri:open-manager-account"));
  });

  profileBack.addEventListener("click", () => {
    stopProfileCamera();
    pendingProfilePhoto = null;
    profilePhoto.value = "";
    releaseProfilePreview();
    document.querySelector('[data-manager-tab="trails"]')?.click();
  });

  profilePhoto.addEventListener("change", () => {
    pendingProfilePhoto = profilePhoto.files?.[0] || null;
    previewProfilePhoto(pendingProfilePhoto);
  });

  profileCamera.addEventListener("click", async () => {
    profileCameraPanel.hidden = false;
    profileCameraMessage.textContent = "Apertura della fotocamera…";
    profileCameraMessage.classList.remove("admin-message--error");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Fotocamera non disponibile in questo browser.");
      stopProfileCamera();
      profileCameraPanel.hidden = false;
      profileCameraMessage.textContent = "Autorizza l’uso della fotocamera.";
      profileCameraStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } }
      });
      profileCameraVideo.srcObject = profileCameraStream;
      await profileCameraVideo.play();
      profileCameraMessage.textContent = "Inquadra il volto e premi Scatta.";
    } catch (error) {
      stopProfileCamera();
      profileCameraPanel.hidden = false;
      profileCameraMessage.textContent = error?.message || "Impossibile aprire la fotocamera.";
      profileCameraMessage.classList.add("admin-message--error");
    }
  });

  profileCameraCapture.addEventListener("click", async () => {
    const sourceWidth = profileCameraVideo.videoWidth;
    const sourceHeight = profileCameraVideo.videoHeight;
    if (!sourceWidth || !sourceHeight) {
      profileCameraMessage.textContent = "La fotocamera non è ancora pronta.";
      profileCameraMessage.classList.add("admin-message--error");
      return;
    }
    const scale = Math.min(1, 1024 / Math.max(sourceWidth, sourceHeight));
    profileCameraCanvas.width = Math.max(1, Math.round(sourceWidth * scale));
    profileCameraCanvas.height = Math.max(1, Math.round(sourceHeight * scale));
    const context = profileCameraCanvas.getContext("2d");
    if (!context) {
      profileCameraMessage.textContent = "Impossibile acquisire la foto.";
      profileCameraMessage.classList.add("admin-message--error");
      return;
    }
    context.drawImage(profileCameraVideo, 0, 0, profileCameraCanvas.width, profileCameraCanvas.height);
    const blob = await new Promise((resolve) => profileCameraCanvas.toBlob(resolve, "image/jpeg", 0.88));
    if (!blob) {
      profileCameraMessage.textContent = "Impossibile acquisire la foto.";
      profileCameraMessage.classList.add("admin-message--error");
      return;
    }
    pendingProfilePhoto = new File([blob], "avatar-" + Date.now() + ".jpg", { type: "image/jpeg" });
    profilePhoto.value = "";
    previewProfilePhoto(pendingProfilePhoto);
    stopProfileCamera();
  });

  profileCameraClose.addEventListener("click", stopProfileCamera);
  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    profileMessage.textContent = "Salvataggio…";
    profileMessage.classList.remove("admin-message--error");
    try {
      activeSession = await api.updateProfile(profileName.value, pendingProfilePhoto);
      activeAvatarUrl = await api.profileAvatarUrl(activeSession.user) || activeAvatarUrl;
      profilePhoto.value = "";
      pendingProfilePhoto = null;
      releaseProfilePreview();
      renderProfile();
      showAccount(activeSession?.user?.email, activeRoleLabel);
      profileMessage.textContent = "Account aggiornato.";
    } catch (error) {
      profileMessage.textContent = readableError(error, "Impossibile aggiornare l’account.");
      profileMessage.classList.add("admin-message--error");
    }
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

  window.addEventListener("online", () => {
    renderSocialProviders();
    renderSession();
  });
  window.addEventListener("sentieri:supabase-session-changed", renderSession);
  window.addEventListener("pagehide", stopProfileCamera);
  renderSocialProviders();
  renderSession();
})();
