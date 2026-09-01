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
/* ==========================================
   PHASE TWO - CELEBRATION CONFETTI SYSTEM
========================================== */

function launchCelebration() {

    const container =
        document.createElement(
            "div"
        );


    container.className =
        "cv-confetti-container";


    document.body.appendChild(
        container
    );


    const symbols = [
        "🎉",
        "🎊",
        "✨",
        "💖",
        "⭐",
        "🎈"
    ];


    const totalParticles =
        window.innerWidth < 600
            ? 35
            : 70;


    for (
        let i = 0;
        i < totalParticles;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "cv-confetti-particle";


        particle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.animationDelay =
            `${Math.random() * 0.8}s`;


        particle.style.animationDuration =
            `${2.5 + Math.random() * 2}s`;


        particle.style.fontSize =
            `${14 + Math.random() * 18}px`;


        container.appendChild(
            particle
        );

    }


    setTimeout(
        () => {

            container.remove();

        },
        5500
    );

}
/* ==========================================
   PHASE TWO - CELEBRATION SUCCESS SCREEN
========================================== */

function showCelebrationSuccess(
    title = "Your Celebration Is Ready! 🎉",
    message = "Your special celebration has been created successfully."
) {

    let successScreen =
        document.getElementById(
            "cvSuccessScreen"
        );


    if (!successScreen) {

        successScreen =
            document.createElement(
                "div"
            );


        successScreen.id =
            "cvSuccessScreen";


        successScreen.className =
            "cv-success-screen";


        successScreen.innerHTML = `

            <div class="cv-success-card">

                <div class="cv-success-glow glow-one"></div>

                <div class="cv-success-glow glow-two"></div>


                <div class="cv-success-icon">

                    <i class="fa-solid fa-check"></i>

                </div>


                <span class="cv-success-label">

                    CELEBRATION COMPLETE

                </span>


                <h2></h2>


                <p></p>


                <div class="cv-success-actions">

                    <button
                        class="cv-success-close">

                        Continue

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            successScreen
        );


        successScreen
            .querySelector(
                ".cv-success-close"
            )
            .addEventListener(
                "click",
                () => {

                    successScreen.classList.remove(
                        "show"
                    );

                }
            );


        successScreen.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    successScreen
                ) {

                    successScreen.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    successScreen
        .querySelector("h2")
        .textContent =
        title;


    successScreen
        .querySelector("p")
        .textContent =
        message;


    successScreen.classList.add(
        "show"
    );


    /* Launch confetti */

    if (
        typeof launchCelebration ===
        "function"
    ) {

        launchCelebration();

    }


    /* Show toast */

    if (
        typeof showToast ===
        "function"
    ) {

        showToast(
            "Your celebration was successful! 🎉",
            "celebration"
        );

    }

}
/* ==========================================
   PHASE THREE - SCROLL PROGRESS SYSTEM
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* Create scroll progress bar */

    const progressBar =
        document.createElement("div");


    progressBar.id =
        "cvScrollProgress";


    document.body.appendChild(
        progressBar
    );


    /* Create back to top button */

    const backToTop =
        document.createElement("button");


    backToTop.id =
        "cvBackToTop";


    backToTop.setAttribute(
        "aria-label",
        "Back to top"
    );


    backToTop.innerHTML = `
        <i class="fa-solid fa-arrow-up"></i>
    `;


    document.body.appendChild(
        backToTop
    );


    /* Update scroll progress */

    function updateScrollProgress() {

        const scrollTop =
            window.scrollY;


        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;


        const progress =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;


        progressBar.style.width =
            `${progress}%`;


        /* Show back button */

        if (scrollTop > 500) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateScrollProgress,
        {
            passive: true
        }
    );


    updateScrollProgress();


    /* Back to top */

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

});
/* ==========================================
   PHASE THREE - ACTIVE NAVIGATION SYSTEM
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );


    const mobileNavLinks =
        document.querySelectorAll(
            ".mobile-menu a"
        );


    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    /* ==========================================
       ACTIVE SECTION DETECTION
    ========================================== */

    function updateActiveNavigation() {

        let currentSection =
            "home";


        const scrollPosition =
            window.scrollY +
            window.innerHeight * 0.35;


        sections.forEach(
            section => {

                const sectionTop =
                    section.offsetTop;


                const sectionHeight =
                    section.offsetHeight;


                if (
                    scrollPosition >=
                    sectionTop
                    &&
                    scrollPosition <
                    sectionTop +
                    sectionHeight
                ) {

                    currentSection =
                        section.id;

                }

            }
        );


        /* Desktop Navigation */

        navLinks.forEach(
            link => {

                const target =
                    link.getAttribute("href");


                link.classList.toggle(

                    "active",

                    target ===
                    `#${currentSection}`

                );

            }
        );


        /* Mobile Navigation */

        mobileNavLinks.forEach(
            link => {

                const target =
                    link.getAttribute("href");


                link.classList.toggle(

                    "active",

                    target ===
                    `#${currentSection}`

                );

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        updateActiveNavigation
    );


    updateActiveNavigation();


    /* ==========================================
       SMOOTH NAVIGATION
    ========================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        const targetId =
                            link.getAttribute(
                                "href"
                            );


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (!target) {

                            return;

                        }


                        event.preventDefault();


                        const navbar =
                            document.querySelector(
                                ".navbar"
                            );


                        const navbarHeight =
                            navbar
                                ? navbar.offsetHeight
                                : 0;


                        const targetPosition =
                            target.getBoundingClientRect()
                                .top +
                            window.pageYOffset -
                            navbarHeight -
                            12;


                        window.scrollTo({

                            top:
                                targetPosition,

                            behavior:
                                "smooth"

                        });


                    }
                );

            }
        );

});
/* ==========================================
   PHASE THREE - INTERACTIVE CURSOR GLOW
   + PREMIUM CARD TILT EFFECT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ------------------------------------------
       CURSOR GLOW
    ------------------------------------------ */

    const supportsHover =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;


    if (supportsHover) {

        const cursorGlow =
            document.createElement("div");


        cursorGlow.id =
            "cvCursorGlow";


        document.body.appendChild(
            cursorGlow
        );


        let mouseX = 0;
        let mouseY = 0;

        let glowX = 0;
        let glowY = 0;


        window.addEventListener(
            "mousemove",
            event => {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;


                cursorGlow.classList.add(
                    "active"
                );

            }
        );


        function animateCursorGlow() {

            glowX +=
                (mouseX - glowX) *
                0.12;


            glowY +=
                (mouseY - glowY) *
                0.12;


            cursorGlow.style.transform =
                `translate3d(
                    ${glowX}px,
                    ${glowY}px,
                    0
                ) translate(
                    -50%,
                    -50%
                )`;


            requestAnimationFrame(
                animateCursorGlow
            );

        }


        animateCursorGlow();


        /* ------------------------------------------
           HIDE GLOW WHEN MOUSE LEAVES WINDOW
        ------------------------------------------ */

        document.addEventListener(
            "mouseleave",
            () => {

                cursorGlow.classList.remove(
                    "active"
                );

            }
        );


        /* ------------------------------------------
           PREMIUM CARD TILT
        ------------------------------------------ */

        const tiltCards =
            document.querySelectorAll(
                ".occasion-card, .price-card, .relationship-item, .step"
            );


        tiltCards.forEach(
            card => {

                card.addEventListener(
                    "mousemove",
                    event => {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left;


                        const y =
                            event.clientY -
                            rect.top;


                        const centerX =
                            rect.width / 2;


                        const centerY =
                            rect.height / 2;


                        const rotateY =
                            (
                                (x - centerX) /
                                centerX
                            ) * 4;


                        const rotateX =
                            (
                                (centerY - y) /
                                centerY
                            ) * 4;


                        card.style.transform =
                            `
                            perspective(900px)
                            rotateX(${rotateX}deg)
                            rotateY(${rotateY}deg)
                            translateY(-6px)
                            `;

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.transform =
                            "";

                    }
                );

            }
        );

    }

});
/* ==========================================
   PHASE THREE - DYNAMIC PARTICLE SYSTEM
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* Respect reduced motion preference */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        return;

    }


    /* Create particle background */

    const particleBackground =
        document.createElement("div");


    particleBackground.id =
        "cvParticleBackground";


    particleBackground.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.prepend(
        particleBackground
    );


    /* Number of particles */

    const particleCount =
        window.innerWidth < 600
            ? 18
            : 35;


    const particleSymbols = [
        "✦",
        "✧",
        "•"
    ];


    /* Create particles */

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "cv-particle";


        particle.textContent =
            particleSymbols[
                Math.floor(
                    Math.random() *
                    particleSymbols.length
                )
            ];


        const size =
            5 +
            Math.random() * 16;


        const left =
            Math.random() * 100;


        const top =
            Math.random() * 100;


        const duration =
            8 +
            Math.random() * 12;


        const delay =
            Math.random() * -15;


        particle.style.left =
            `${left}%`;


        particle.style.top =
            `${top}%`;


        particle.style.fontSize =
            `${size}px`;


        particle.style.animationDuration =
            `${duration}s`;


        particle.style.animationDelay =
            `${delay}s`;


        particle.style.opacity =
            0.15 +
            Math.random() * 0.55;


        particleBackground.appendChild(
            particle
        );

    }


    /* ==========================================
       PARALLAX EFFECT
    ========================================== */

    let ticking =
        false;


    window.addEventListener(
        "scroll",
        () => {

            if (ticking) {

                return;

            }


            window.requestAnimationFrame(
                () => {

                    const offset =
                        window.scrollY *
                        0.04;


                    particleBackground.style.transform =
                        `translateY(${offset}px)`;


                    ticking =
                        false;

                }
            );


            ticking =
                true;

        },
        {
            passive: true
        }
    );

});
/* ==========================================
   PHASE THREE - MAGNETIC BUTTON SYSTEM
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* Only enable on mouse / desktop devices */

    const supportsHover =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;


    if (!supportsHover) {

        return;

    }


    /* Buttons that will have magnetic effect */

    const magneticButtons =
        document.querySelectorAll(
            ".primary-btn, " +
            ".secondary-btn, " +
            ".nav-cta, " +
            ".mobile-cta, " +
            ".price-btn, " +
            ".install-app-btn"
        );


    magneticButtons.forEach(
        button => {

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    /* Magnetic strength */

                    const moveX =
                        (x - centerX) *
                        0.18;


                    const moveY =
                        (y - centerY) *
                        0.18;


                    button.style.transform =
                        `translate(
                            ${moveX}px,
                            ${moveY}px
                        )`;

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform =
                        "";

                }
            );

        }
    );

});


/* CelebrateVerse persistent theme preference */
(() => {
  const saved = localStorage.getItem("celebrateVerseTheme");
  if (saved === "light") document.body.classList.add("light-mode");
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      setTimeout(() => localStorage.setItem("celebrateVerseTheme",
        document.body.classList.contains("light-mode") ? "light" : "dark"), 0);
    });
  }
})();

document.addEventListener("click", (event) => {
  const menu = document.querySelector(".nav-links");
  const toggle = document.querySelector(".mobile-menu-btn, .menu-toggle");
  if (menu && menu.classList.contains("active") && !menu.contains(event.target) && toggle && !toggle.contains(event.target)) {
    menu.classList.remove("active");
  }
});
