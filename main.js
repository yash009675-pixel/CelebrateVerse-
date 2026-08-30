/* =========================
   PAGE LOADER
========================= */

window.addEventListener("load", () => {

  const loader =
    document.getElementById("loader");

  setTimeout(() => {

    loader.classList.add("hidden");

  }, 1600);

});


/* =========================
   MOBILE MENU
========================= */

const mobileMenuBtn =
  document.getElementById("mobileMenuBtn");

const mobileMenu =
  document.getElementById("mobileMenu");


if (mobileMenuBtn) {

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

document.querySelectorAll(
  ".mobile-menu a"
).forEach(link => {

  link.addEventListener(
    "click",
    () => {

      mobileMenu.classList.remove(
        "active"
      );

    }
  );

});


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
  document.querySelector(".navbar");


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


/* =========================
   SCROLL ANIMATION
========================= */

const observer =
  new IntersectionObserver(

    (entries) => {

      entries.forEach(entry => {

        if (
          entry.isIntersecting
        ) {

          entry.target.style.opacity =
            "1";

          entry.target.style.transform =
            "translateY(0)";

        }

      });

    },

    {
      threshold: 0.1
    }

  );


document.querySelectorAll(
  ".occasion-card, .step, .price-card, .relationship-item"
).forEach(element => {

  element.style.opacity = "0";

  element.style.transform =
    "translateY(30px)";

  element.style.transition =
    "0.6s ease";

  observer.observe(element);

});
