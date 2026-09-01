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
        showMessage("Account created. Please check your email and confirm your account before logging in.", true);
      }
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

      if (error) return showMessage("Incorrect email or password.");
      await ensureProfile(data.user);
      showMessage("Login successful! Redirecting...", true);
      setTimeout(() => window.location.href = "dashboard.html", 500);
    });
  }
});
