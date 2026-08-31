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
        alert("Install prompt is not ready yet.\n\nTry this:\n• Android/Desktop: open the site in Chrome or Edge, then wait a few seconds and click Install App again.\n• iPhone/iPad: open in Safari, tap Share, then Add to Home Screen.\n\nIf you just updated the website, refresh once so the new app setup can load.");
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


/* ==========================================
   CELEBRATEVERSE COMPLETE WEB APP FEATURES
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const installButton = document.getElementById("installAppBtn");
    let deferredPrompt = null;

    /* Android + Desktop install prompt */
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        deferredPrompt = event;

        if (installButton) {
            installButton.dataset.installReady = "true";
        }
    });

    /* Universal install button */
    if (installButton) {
        installButton.style.display = "inline-flex";

        installButton.addEventListener("click", async () => {

            if (window.matchMedia("(display-mode: standalone)").matches ||
                window.navigator.standalone === true) {
                showAppMessage(
                    "CelebrateVerse is already installed on this device. 📱"
                );
                return;
            }

            if (deferredPrompt) {
                deferredPrompt.prompt();

                const result = await deferredPrompt.userChoice;

                if (result.outcome === "accepted") {
                    installButton.innerHTML =
                        '<i class="fa-solid fa-check"></i> Installing...';
                }

                deferredPrompt = null;
                return;
            }

            const isIOS =
                /iphone|ipad|ipod/i.test(navigator.userAgent);

            if (isIOS) {
                showAppMessage(
                    "Install CelebrateVerse 📱\n\n1. Open this site in Safari\n2. Tap the Share button\n3. Choose “Add to Home Screen”\n4. Tap Add"
                );
                return;
            }

            showAppMessage(
                "Install is not ready yet. Please wait a few seconds and try again. Make sure the site is opened through HTTPS in Chrome or Edge."
            );
        });
    }

    /* Installed state */
    window.addEventListener("appinstalled", () => {
        if (installButton) {
            installButton.innerHTML =
                '<i class="fa-solid fa-check"></i> App Installed';
            installButton.disabled = true;
        }

        showAppMessage("CelebrateVerse was installed successfully! 🎉");
    });

    /* Offline / online status */
    function updateConnectionStatus() {
        let banner = document.getElementById("connectionStatus");

        if (!banner) {
            banner = document.createElement("div");
            banner.id = "connectionStatus";
            banner.className = "connection-status";
            document.body.appendChild(banner);
        }

        if (navigator.onLine) {
            banner.textContent = "Back online ✓";
            banner.classList.add("online");

            setTimeout(() => {
                banner.classList.remove("show");
            }, 1800);
        } else {
            banner.textContent = "You are offline";
            banner.classList.remove("online");
            banner.classList.add("show");
        }
    }

    window.addEventListener("offline", updateConnectionStatus);

    window.addEventListener("online", () => {
        updateConnectionStatus();

        const banner =
            document.getElementById("connectionStatus");

        if (banner) banner.classList.add("show");
    });

    if (!navigator.onLine) {
        updateConnectionStatus();
    }

    /* App update detection */
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(registration => {

            registration.addEventListener("updatefound", () => {

                const newWorker = registration.installing;

                if (!newWorker) return;

                newWorker.addEventListener("statechange", () => {

                    if (
                        newWorker.state === "installed" &&
                        navigator.serviceWorker.controller
                    ) {
                        showUpdateButton(registration);
                    }

                });

            });

        });

        let refreshing = false;

        navigator.serviceWorker.addEventListener(
            "controllerchange",
            () => {

                if (refreshing) return;

                refreshing = true;

                window.location.reload();

            }
        );
    }

});


function showAppMessage(message) {

    let modal =
        document.getElementById("celebrateVerseAppModal");

    if (!modal) {

        modal =
            document.createElement("div");

        modal.id =
            "celebrateVerseAppModal";

        modal.className =
            "cv-app-modal";

        modal.innerHTML = `
            <div class="cv-app-modal-card">
                <button class="cv-app-modal-close" aria-label="Close">
                    ×
                </button>
                <div class="cv-app-modal-icon">📱</div>
                <h3>CelebrateVerse</h3>
                <p></p>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector(".cv-app-modal-close")
            .addEventListener("click", () => {
                modal.classList.remove("show");
            });

        modal.addEventListener("click", event => {
            if (event.target === modal) {
                modal.classList.remove("show");
            }
        });
    }

    modal.querySelector("p").textContent =
        message;

    modal.classList.add("show");
}


function showUpdateButton(registration) {

    if (
        document.getElementById(
            "celebrateVerseUpdateButton"
        )
    ) return;

    const updateButton =
        document.createElement("button");

    updateButton.id =
        "celebrateVerseUpdateButton";

    updateButton.className =
        "cv-update-button";

    updateButton.innerHTML =
        '<i class="fa-solid fa-rotate"></i> Update Available';

    document.body.appendChild(
        updateButton
    );

    updateButton.addEventListener(
        "click",
        () => {

            if (
                registration.waiting
            ) {

                registration.waiting.postMessage(
                    {
                        type:
                            "SKIP_WAITING"
                    }
                );

            }

        }
    );

}
