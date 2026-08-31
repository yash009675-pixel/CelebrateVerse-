alert("NEW MAIN.JS IS LOADING SUCCESSFULLY");

/* ==========================================
   CELEBRATEVERSE - MAIN JAVASCRIPT
   CLEAN WEB APP / PWA VERSION
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       MOBILE MENU
    ========================================== */

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mobileMenu =
        document.getElementById("mobileMenu");


    if (mobileMenuBtn && mobileMenu) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                mobileMenu.classList.toggle(
                    "active"
                );

            }
        );

    }


    if (mobileMenu) {

        document
            .querySelectorAll(".mobile-menu a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu.classList.remove(
                            "active"
                        );

                    }
                );

            });

    }


    /* ==========================================
       DARK / LIGHT MODE
    ========================================== */

    const themeToggle =
        document.getElementById("themeToggle");


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-mode"
                );


                const icon =
                    themeToggle.querySelector("i");


                if (icon) {

                    icon.className =
                        document.body.classList.contains(
                            "light-mode"
                        )
                            ? "fa-solid fa-sun"
                            : "fa-solid fa-moon";

                }

            }
        );

    }


    /* ==========================================
       NAVBAR SCROLL EFFECT
    ========================================== */

    const navbar =
        document.querySelector(".navbar");


    if (navbar) {

        window.addEventListener(
            "scroll",
            () => {

                navbar.style.boxShadow =
                    window.scrollY > 50
                        ? "0 10px 40px rgba(0,0,0,.15)"
                        : "none";

            }
        );

    }


    /* ==========================================
       PWA / WEB APP SYSTEM
    ========================================== */

    const installButton =
        document.getElementById(
            "installAppBtn"
        );


    let deferredInstallPrompt =
        null;


    /* ==========================================
       DETECT INSTALLED APP
    ========================================== */

    const isStandalone =
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches ||
        window.navigator.standalone === true;


    if (isStandalone) {

        document.body.classList.add(
            "app-mode"
        );


        if (installButton) {

            installButton.innerHTML =
                '<i class="fa-solid fa-check"></i> App Installed';

            installButton.disabled =
                true;

        }

    }


    /* ==========================================
       REGISTER SERVICE WORKER
    ========================================== */

    if (
        "serviceWorker" in navigator
    ) {

        window.addEventListener(
            "load",
            async () => {

                try {

                    const registration =
                        await navigator
                            .serviceWorker
                            .register(
                                "./sw.js"
                            );


                    console.log(
                        "CelebrateVerse Web App Ready",
                        registration
                    );

                } catch (error) {

                    console.error(
                        "Service Worker Error:",
                        error
                    );

                }

            }
        );

    }


    /* ==========================================
       ANDROID / DESKTOP INSTALL PROMPT
    ========================================== */

    window.addEventListener(
        "beforeinstallprompt",
        event => {

            event.preventDefault();


            deferredInstallPrompt =
                event;


            console.log(
                "Install prompt is ready"
            );


            if (installButton) {

                installButton.dataset.ready =
                    "true";

            }

        }
    );


    /* ==========================================
       INSTALL BUTTON
    ========================================== */

    if (installButton) {

        /* Always visible */

        installButton.style.display =
            "inline-flex";


        installButton.addEventListener(
            "click",
            async () => {

                /* Already installed */

                if (
                    window.matchMedia(
                        "(display-mode: standalone)"
                    ).matches ||
                    window.navigator.standalone === true
                ) {

                    showAppMessage(
                        "CelebrateVerse is already installed on this device. 📱"
                    );

                    return;

                }


                /* Android / Desktop */

                if (
                    deferredInstallPrompt
                ) {

                    deferredInstallPrompt.prompt();


                    const result =
                        await deferredInstallPrompt
                            .userChoice;


                    if (
                        result.outcome ===
                        "accepted"
                    ) {

                        installButton.innerHTML =
                            '<i class="fa-solid fa-check"></i> Installing...';

                    }


                    deferredInstallPrompt =
                        null;


                    return;

                }


                /* iPhone / iPad */

                const isIOS =
                    /iphone|ipad|ipod/i.test(
                        navigator.userAgent
                    );


                if (isIOS) {

                    showAppMessage(
                        "Install CelebrateVerse on iPhone 📱\n\n" +
                        "1. Open this website in Safari\n\n" +
                        "2. Tap the Share button\n\n" +
                        "3. Scroll down and select “Add to Home Screen”\n\n" +
                        "4. Tap Add"
                    );

                    return;

                }


                /* Browser not ready */

                showAppMessage(
                    "The install option is not ready yet.\n\n" +
                    "Please wait a few seconds and try again.\n\n" +
                    "Make sure you are opening the website using HTTPS in Chrome or Microsoft Edge."
                );

            }
        );

    }


    /* ==========================================
       APP INSTALLED
    ========================================== */

    window.addEventListener(
        "appinstalled",
        () => {

            console.log(
                "CelebrateVerse installed successfully"
            );


            if (installButton) {

                installButton.innerHTML =
                    '<i class="fa-solid fa-check"></i> App Installed';


                installButton.disabled =
                    true;

            }


            showAppMessage(
                "CelebrateVerse has been installed successfully! 🎉📱"
            );

        }
    );


    /* ==========================================
       ONLINE / OFFLINE STATUS
    ========================================== */

    function updateConnectionStatus() {

        let banner =
            document.getElementById(
                "connectionStatus"
            );


        if (!banner) {

            banner =
                document.createElement(
                    "div"
                );


            banner.id =
                "connectionStatus";


            banner.className =
                "connection-status";


            document.body.appendChild(
                banner
            );

        }


        if (
            navigator.onLine
        ) {

            banner.textContent =
                "Back online ✓";


            banner.classList.add(
                "online"
            );


            banner.classList.add(
                "show"
            );


            setTimeout(
                () => {

                    banner.classList.remove(
                        "show"
                    );

                },
                1800
            );

        } else {

            banner.textContent =
                "You are offline";


            banner.classList.remove(
                "online"
            );


            banner.classList.add(
                "show"
            );

        }

    }


    window.addEventListener(
        "offline",
        updateConnectionStatus
    );


    window.addEventListener(
        "online",
        updateConnectionStatus
    );


    if (
        !navigator.onLine
    ) {

        updateConnectionStatus();

    }


});


/* ==========================================
   APP MESSAGE MODAL
========================================== */

function showAppMessage(message) {

    let modal =
        document.getElementById(
            "celebrateVerseAppModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );


        modal.id =
            "celebrateVerseAppModal";


        modal.className =
            "cv-app-modal";


        modal.innerHTML = `

            <div class="cv-app-modal-card">

                <button
                    class="cv-app-modal-close"
                    aria-label="Close">

                    ×

                </button>


                <div class="cv-app-modal-icon">
                    📱
                </div>


                <h3>
                    CelebrateVerse
                </h3>


                <p></p>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        modal
            .querySelector(
                ".cv-app-modal-close"
            )
            .addEventListener(
                "click",
                () => {

                    modal.classList.remove(
                        "show"
                    );

                }
            );


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    modal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    modal
        .querySelector("p")
        .textContent =
        message;


    modal.classList.add(
        "show"
    );

}


/* ==========================================
   PAGE LOADER
========================================== */

window.addEventListener(
    "load",
    () => {

        const loader =
            document.getElementById(
                "loader"
            );


        if (loader) {

            setTimeout(
                () => {

                    loader.classList.add(
                        "hidden"
                    );

                },
                1600
            );

        }

    }
);
/* ==========================================
   PHASE TWO - SCROLL REVEAL ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(
        `
        .section-header,
        .occasion-card,
        .relationship-content,
        .relationship-item,
        .step,
        .price-card,
        .final-cta
        `
    );


    revealElements.forEach((element, index) => {

        element.classList.add("reveal");

        if (
            element.classList.contains("occasion-card") ||
            element.classList.contains("relationship-item") ||
            element.classList.contains("step") ||
            element.classList.contains("price-card")
        ) {

            element.style.transitionDelay =
                `${(index % 6) * 0.08}s`;

        }

    });


    const revealObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "reveal-active"
                        );


                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


    revealElements.forEach(element => {

        revealObserver.observe(
            element
        );

    });

});
/* ==========================================
   PHASE TWO - PREMIUM TOAST NOTIFICATIONS
========================================== */

function showToast(
    message,
    type = "success",
    duration = 3500
) {

    let toastContainer =
        document.getElementById(
            "cvToastContainer"
        );


    if (!toastContainer) {

        toastContainer =
            document.createElement(
                "div"
            );


        toastContainer.id =
            "cvToastContainer";


        toastContainer.className =
            "cv-toast-container";


        document.body.appendChild(
            toastContainer
        );

    }


    const icons = {

        success:
            '<i class="fa-solid fa-circle-check"></i>',

        error:
            '<i class="fa-solid fa-circle-xmark"></i>',

        info:
            '<i class="fa-solid fa-circle-info"></i>',

        celebration:
            '<i class="fa-solid fa-sparkles"></i>'

    };


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `cv-toast ${type}`;


    toast.innerHTML = `

        <div class="cv-toast-icon">

            ${icons[type] || icons.info}

        </div>


        <div class="cv-toast-message">

            ${message}

        </div>


        <button
            class="cv-toast-close"
            aria-label="Close notification">

            ×

        </button>

    `;


    toastContainer.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            toast.classList.add(
                "show"
            );

        }
    );


    const closeToast =
        () => {

            toast.classList.remove(
                "show"
            );


            setTimeout(
                () => {

                    toast.remove();

                },
                350
            );

        };


    toast
        .querySelector(
            ".cv-toast-close"
        )
        .addEventListener(
            "click",
            closeToast
        );


    setTimeout(
        closeToast,
        duration
    );

}
showToast(
    "Welcome to CelebrateVerse! ✨",
    "celebration"
);
