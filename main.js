/* =========================
   CELEBRATEVERSE MAIN JS
========================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE MENU
    ========================= */

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


    /* =========================
       THEME TOGGLE
    ========================= */

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


                if (!icon) return;


                if (
                    document.body.classList.contains(
                        "light-mode"
                    )
                ) {

                    icon.classList.remove(
                        "fa-moon"
                    );

                    icon.classList.add(
                        "fa-sun"
                    );

                } else {

                    icon.classList.remove(
                        "fa-sun"
                    );

                    icon.classList.add(
                        "fa-moon"
                    );

                }

            }
        );

    }


    /* =========================
       NAVBAR SCROLL
    ========================= */

    const navbar =
        document.querySelector(".navbar");


    if (navbar) {

        window.addEventListener(
            "scroll",
            () => {

                if (window.scrollY > 50) {

                    navbar.style.boxShadow =
                        "0 10px 40px rgba(0,0,0,0.15)";

                } else {

                    navbar.style.boxShadow =
                        "none";

                }

            }
        );

    }


    /* =========================
       SCROLL ANIMATION
    ========================= */

    const animatedElements =
        document.querySelectorAll(
            ".occasion-card, .step, .price-card, .relationship-item"
        );


    if (
        "IntersectionObserver" in window &&
        animatedElements.length > 0
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.style.opacity =
                                    "1";

                                entry.target.style.transform =
                                    "translateY(0)";

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.1
                }
            );


        animatedElements.forEach(
            element => {

                element.style.opacity = "0";

                element.style.transform =
                    "translateY(30px)";

                element.style.transition =
                    "opacity 0.6s ease, transform 0.6s ease";

                observer.observe(element);

            }
        );

    }


    /* =========================
       PWA INSTALL SYSTEM
    ========================= */

    const installButton =
        document.getElementById(
            "installAppBtn"
        );


    let deferredInstallPrompt =
        null;


    /* =========================
       SERVICE WORKER
    ========================= */

    if ("serviceWorker" in navigator) {

        window.addEventListener(
            "load",
            () => {

                navigator
                    .serviceWorker
                    .register("./sw.js")
                    .then(
                        registration => {

                            console.log(
                                "CelebrateVerse App Ready",
                                registration
                            );

                        }
                    )
                    .catch(
                        error => {

                            console.error(
                                "Service Worker Error:",
                                error
                            );

                        }
                    );

            }
        );

    }


    /* =========================
       ANDROID + DESKTOP PROMPT
    ========================= */

    window.addEventListener(
        "beforeinstallprompt",
        event => {

            event.preventDefault();

            deferredInstallPrompt =
                event;

            console.log(
                "CelebrateVerse can be installed"
            );

        }
    );


    /* =========================
       INSTALL BUTTON CLICK
    ========================= */

    if (installButton) {

        installButton.addEventListener(
            "click",
            async () => {

                /* ANDROID / DESKTOP */

                if (
                    deferredInstallPrompt
                ) {

                    deferredInstallPrompt.prompt();


                    const choice =
                        await deferredInstallPrompt
                            .userChoice;


                    console.log(
                        "Install result:",
                        choice.outcome
                    );


                    if (
                        choice.outcome ===
                        "accepted"
                    ) {

                        installButton.innerHTML = `
                            <i class="fa-solid fa-check"></i>
                            Installing...
                        `;

                    }


                    deferredInstallPrompt =
                        null;

                    return;

                }


                /* iPHONE / iPAD */

                const isIOS =
                    /iphone|ipad|ipod/i.test(
                        navigator.userAgent
                    );


                if (isIOS) {

                    alert(
                        "Install CelebrateVerse 📱\n\n" +
                        "1. Tap the Share button ⎋\n\n" +
                        "2. Scroll down and tap\n" +
                        "'Add to Home Screen'\n\n" +
                        "3. Tap Add\n\n" +
                        "CelebrateVerse will appear like a normal app on your Home Screen."
                    );

                    return;

                }


                /* OTHER DEVICES */

                alert(
                    "To install CelebrateVerse, please open this website in Chrome, Edge or another supported browser."
                );

            }
        );

    }


    /* =========================
       APP INSTALLED
    ========================= */

    window.addEventListener(
        "appinstalled",
        () => {

            console.log(
                "CelebrateVerse installed successfully"
            );


            if (installButton) {

                installButton.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    App Installed
                `;

            }

        }
    );


    /* =========================
       STANDALONE APP MODE
    ========================= */

    const isStandalone =
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches ||
        window.navigator.standalone === true;


    if (isStandalone) {

        document.body.classList.add(
            "app-mode"
        );

    }


});


/* =========================
   PAGE LOADER
========================= */

window.addEventListener(
    "load",
    () => {

        const loader =
            document.getElementById("loader");


        if (!loader) return;


        setTimeout(
            () => {

                loader.classList.add(
                    "hidden"
                );

            },
            1600
        );

    }
);
