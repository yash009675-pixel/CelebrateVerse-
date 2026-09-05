// CelebrateVerse authentication helpers
// Keep all email links on the live GitHub Pages site. Using window.location here
// can accidentally generate localhost links when the app is tested locally.
const CELEBRATEVERSE_BASE_URL = "https://yash009675-pixel.github.io/CelebrateVerse-/";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const authMessage = document.getElementById("authMessage");

  function showMessage(message, success = false) {
    if (!authMessage) return;
    authMessage.textContent = message;
    authMessage.className = success ? "auth-message success" : "auth-message error";
  }

  function addActionLink(text, href, className = "auth-submit") {
    if (!authMessage) return;
    const old = document.getElementById("cvAuthAction");
    if (old) old.remove();
    const link = document.createElement("a");
    link.id = "cvAuthAction";
    link.href = href;
    link.className = className;
    link.style.cssText = "display:flex;justify-content:center;align-items:center;text-decoration:none;margin-top:14px;";
    link.textContent = text;
    authMessage.insertAdjacentElement("afterend", link);
    return link;
  }

  async function ensureProfile(user, name = "") {
    if (!supabaseClient || !user) return;
    await supabaseClient.from("profiles").upsert({
      id: user.id,
      full_name: name || user.user_metadata?.full_name || user.email?.split("@")[0] || "CelebrateVerse User",
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });
  }

  // Always use the production URL for Supabase auth email redirects.
  const loginUrl = CELEBRATEVERSE_BASE_URL + "login.html";
  const resetUrl = CELEBRATEVERSE_BASE_URL + "reset-password.html";

  // After a user clicks the Supabase confirmation link, Supabase can return
  // a valid session to login.html. Detect that session and finish the flow.
  if ((loginForm || signupForm) && supabaseClient) {
    supabaseClient.auth.getSession().then(async ({ data }) => {
      const session = data?.session;
      if (!session?.user) return;
      if (window.location.pathname.endsWith("/login.html") || window.location.pathname.endsWith("/signup.html")) {
        await ensureProfile(session.user);
        showMessage("Email confirmed successfully! Opening your dashboard…", true);
        setTimeout(() => { window.location.href = "dashboard.html"; }, 500);
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.replace(/\s/g, "").trim().toLowerCase();
      const password = document.getElementById("signupPassword").value;

      if (!supabaseClient) return showMessage("Authentication service is not available.");

      if (!name) {
        showMessage("Please enter your name.");
        document.getElementById("signupName")?.focus();
        return;
      }
      if (!email) {
        showMessage("Please enter your email address.");
        document.getElementById("signupEmail")?.focus();
        return;
      }
      if (!email.includes("@") || email.startsWith("@") || email.endsWith("@") || !email.includes(".", email.indexOf("@") + 2)) {
        showMessage("Please enter a valid email address.");
        document.getElementById("signupEmail")?.focus();
        return;
      }
      if (!password) {
        showMessage("Please create a password.");
        document.getElementById("signupPassword")?.focus();
        return;
      }
      if (password.length < 6) {
        showMessage("Password must be at least 6 characters.");
        document.getElementById("signupPassword")?.focus();
        return;
      }

      const button = signupForm.querySelector('button[type="submit"]');
      button.disabled = true;
      const original = button.innerHTML;
      button.textContent = "Creating account...";

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: loginUrl
        }
      });

      button.disabled = false;
      button.innerHTML = original;

      if (error) return showMessage(error.message);

      if (data.user && data.session) {
        await ensureProfile(data.user, name);
        showMessage("Account created successfully! Redirecting...", true);
        setTimeout(() => window.location.href = "dashboard.html", 700);
      } else {
        showMessage("If this email is new, check your inbox for the confirmation link. If you already have a CelebrateVerse account, use Login instead.", true);
        addActionLink("Continue to Login →", "login.html");
      }
    });
  }

  const forgotPassword = document.getElementById("forgotPassword");
  if (forgotPassword) {
    forgotPassword.addEventListener("click", async (event) => {
      event.preventDefault();
      const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
      if (!email) return showMessage("Enter your email address first, then tap Forgot password.");
      if (!supabaseClient) return showMessage("Authentication service is not available.");
      forgotPassword.textContent = "Sending...";
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl
      });
      forgotPassword.textContent = "Forgot password?";
      if (error) return showMessage("Could not send reset email: " + error.message);
      showMessage("Password reset email sent. Check your inbox.", true);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("loginEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value;

      if (!supabaseClient) return showMessage("Authentication service is not available.");

      const button = loginForm.querySelector('button[type="submit"]');
      button.disabled = true;
      const original = button.innerHTML;
      button.textContent = "Logging in...";

      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

      button.disabled = false;
      button.innerHTML = original;

      if (error) {
        console.error("CelebrateVerse login error:", error);

        const code = String(error.code || "").toLowerCase();
        const message = String(error.message || "").toLowerCase();

        if (
          code === "email_not_confirmed" ||
          message.includes("email not confirmed") ||
          message.includes("email confirmation")
        ) {
          showMessage("Your email is not confirmed yet. Check your inbox, then try again.");
          const resend = addActionLink("Resend Confirmation Email", "#");
          if (resend) {
            resend.addEventListener("click", async (e) => {
              e.preventDefault();
              resend.textContent = "Sending...";
              const result = await supabaseClient.auth.resend({
                type: "signup",
                email,
                options: { emailRedirectTo: loginUrl }
              });
              if (result.error) {
                resend.textContent = "Resend Confirmation Email";
                return showMessage("Could not resend confirmation email: " + result.error.message);
              }
              resend.textContent = "Confirmation Email Sent ✓";
              showMessage("Confirmation email sent. Check your inbox and Spam folder.", true);
            });
          }
          return;
        }

        if (
          code === "invalid_credentials" ||
          message.includes("invalid login credentials") ||
          message.includes("invalid credentials")
        ) {
          return showMessage("Incorrect email or password. Please check both and try again.");
        }

        if (message.includes("rate limit") || message.includes("too many requests")) {
          return showMessage("Too many login attempts. Please wait a little and try again.");
        }

        return showMessage("Login failed: " + (error.message || "Authentication error."));
      }

      if (!data?.user) {
        return showMessage("Login failed: no user session was returned. Please try again.");
      }

      await ensureProfile(data.user);
      showMessage("Login successful! Redirecting...", true);
      setTimeout(() => window.location.href = "dashboard.html", 500);
    });
  }
});