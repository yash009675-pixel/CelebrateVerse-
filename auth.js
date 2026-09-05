document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const authMessage = document.getElementById("authMessage");

  function showMessage(message, success = false) {
    if (!authMessage) return;
    authMessage.textContent = message;
    authMessage.className = success ? "auth-message success" : "auth-message error";
  }

  async function ensureProfile(user, name = "") {
    if (!supabaseClient || !user) return;
    await supabaseClient.from("profiles").upsert({
      id: user.id,
      full_name: name || user.user_metadata?.full_name || user.email?.split("@")[0] || "CelebrateVerse User",
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim().toLowerCase();
      const password = document.getElementById("signupPassword").value;

      if (!supabaseClient) return showMessage("Authentication service is not available.");
      if (!name || !email || !password) return showMessage("Please fill all fields.");
      if (password.length < 6) return showMessage("Password must be at least 6 characters.");

      const button = signupForm.querySelector('button[type="submit"]');
      button.disabled = true;
      const original = button.innerHTML;
      button.textContent = "Creating account...";

      const { data, error } = await supabaseClient.auth.signUp({
        email, password, options: { data: { full_name: name } }
      });

      button.disabled = false;
      button.innerHTML = original;

      if (error) return showMessage(error.message);

      if (data.user && data.session) {
        await ensureProfile(data.user, name);
        showMessage("Account created successfully! Redirecting...", true);
        setTimeout(() => window.location.href = "dashboard.html", 700);
      } else {
        showMessage("Account created successfully! Please confirm your email first.", true);\n        const loginLink = document.createElement("a");\n        loginLink.href = "login.html";\n        loginLink.className = "auth-submit";\n        loginLink.style.cssText = "display:flex;justify-content:center;align-items:center;text-decoration:none;margin-top:14px;";\n        loginLink.innerHTML = "Continue to Login <i class=\"fa-solid fa-arrow-right\"></i>";\n        authMessage.insertAdjacentElement("afterend", loginLink);
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
        redirectTo: new URL("reset-password.html", window.location.href).href
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
          return showMessage("Your email is not confirmed yet. Please check your inbox and confirm your email before logging in.");
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
