/* =========================
   CELEBRATEVERSE MAIN JS
========================= */


/* =========================
   PAGE LOADER
========================= */

window.addEventListener(
    "load",
    () => {

        const loader =
            document.getElementById(
                "loader"
            );


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


/* =========================
   MOBILE MENU
========================= */

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );


const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


if (
    mobileMenuBtn &&
    mobileMenu
) {

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================
   CLOSE MOBILE MENU
========================= */

if (mobileMenu) {

    document.querySelectorAll(
        ".mobile-menu a"
    ).forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    mobileMenu.classList.remove(
                        "active"
                    );

                }
            );

        }
    );

}


/* =========================
   THEME TOGGLE
========================= */

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-mode"
            );


            const icon =
                themeToggle.querySelector(
                    "i"
                );


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
   NAVBAR SCROLL EFFECT
========================= */

const navbar =
    document.querySelector(
        ".navbar"
    );


if (navbar) {

    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 50
            ) {

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

            element.style.opacity =
                "0";


            element.style.transform =
                "translateY(30px)";


            element.style.transition =
                "opacity 0.6s ease, transform 0.6s ease";


            observer.observe(
                element
            );

        }
    );

}


/* =========================
   CELEBRATEVERSE PWA
   SERVICE WORKER
========================= */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        async () => {

            try {

                const registration =
                    await navigator.serviceWorker.register(
                        "./sw.js"
                    );


                console.log(
                    "CelebrateVerse Web App Ready:",
                    registration
                );


            } catch (error) {

                console.error(
                    "CelebrateVerse Service Worker Error:",
                    error
                );

            }

        }
    );

}


/* =========================
   PWA INSTALL SYSTEM
========================= */

let deferredInstallPrompt =
    null;


window.addEventListener(
    "beforeinstallprompt",
    event => {

        event.preventDefault();


        deferredInstallPrompt =
            event;


        console.log(
            "CelebrateVerse can now be installed."
        );


        showInstallButton();

    }
);


/* =========================
   SHOW INSTALL BUTTON
========================= */

function showInstallButton() {

    const installButton =
        document.getElementById(
            "installAppBtn"
        );


    if (!installButton) return;


    installButton.style.display =
        "inline-flex";

}


/* =========================
   INSTALL BUTTON CLICK
========================= */

document.addEventListener(
    "click",
    async event => {

        const installButton =
            event.target.closest(
                "#installAppBtn"
            );


        if (!installButton) return;


        /* =========================
           ANDROID / CHROME INSTALL
        ========================= */

        if (
            deferredInstallPrompt
        ) {

            deferredInstallPrompt.prompt();


            const choice =
                await deferredInstallPrompt.userChoice;


            console.log(
                "Install choice:",
                choice.outcome
            );


            deferredInstallPrompt =
                null;


            installButton.style.display =
                "none";


            return;

        }


        /* =========================
           iPHONE / SAFARI MESSAGE
        ========================= */

        const isIOS =
            /iphone|ipad|ipod/i.test(
                navigator.userAgent
            );


        if (isIOS) {

            alert(
                "To install CelebrateVerse:\n\n" +
                "1. Tap the Share button ⎋\n\n" +
                "2. Scroll down\n\n" +
                "3. Tap 'Add to Home Screen'\n\n" +
                "4. Tap Add"
            );

        } else {

            alert(
                "Install is not available yet. Please open CelebrateVerse in a supported browser such as Chrome or Safari."
            );

        }

    }
);


/* =========================
   APP INSTALLED
========================= */

window.addEventListener(
    "appinstalled",
    () => {

        console.log(
            "CelebrateVerse installed successfully."
        );


        deferredInstallPrompt =
            null;


        const installButton =
            document.getElementById(
                "installAppBtn"
            );


        if (installButton) {

            installButton.style.display =
                "none";

        }

    }
);


/* =========================
   PWA STANDALONE MODE
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
