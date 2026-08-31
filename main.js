/* CelebrateVerse main JavaScript */
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenuBtn && mobileMenu) mobileMenuBtn.addEventListener("click", () => mobileMenu.classList.toggle("active"));
  if (mobileMenu) document.querySelectorAll(".mobile-menu a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("active")));

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const icon = themeToggle.querySelector("i");
    if (icon) icon.className = document.body.classList.contains("light-mode") ? "fa-solid fa-sun" : "fa-solid fa-moon";
  });

  const navbar = document.querySelector(".navbar");
  if (navbar) window.addEventListener("scroll", () => navbar.style.boxShadow = window.scrollY > 50 ? "0 10px 40px rgba(0,0,0,.15)" : "none");

  let deferredInstallPrompt = null;
  const installButton = document.getElementById("installAppBtn");

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").then(r => console.log("CelebrateVerse PWA ready", r)).catch(e => console.error("Service Worker Error:", e)));
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  if (installButton) {
    installButton.addEventListener("click", async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;
        if (choice.outcome === "accepted") installButton.innerHTML = '<i class="fa-solid fa-check"></i> Installing...';
        deferredInstallPrompt = null;
        return;
      }
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      if (isIOS) {
        alert("Install CelebrateVerse 📱\n\n1. Tap the Share button ⎋\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap Add");
      } else {
        alert("Install is not available yet in this browser. Open CelebrateVerse in Chrome, Edge, or Safari. If you already installed it, launch it from your app/home screen.");
      }
    });
  }

  window.addEventListener("appinstalled", () => {
    if (installButton) {
      installButton.innerHTML = '<i class="fa-solid fa-check"></i> App Installed';
      installButton.disabled = true;
    }
  });

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (isStandalone) document.body.classList.add("app-mode");
});

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) setTimeout(() => loader.classList.add("hidden"), 1600);
});
