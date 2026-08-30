let currentStep = 1;
const totalSteps = 5;

const form = document.getElementById("celebrationForm");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");

const progressFill = document.getElementById("progressFill");


/* =========================
   GET URL PARAMETERS
========================= */

const params = new URLSearchParams(window.location.search);

const selectedOccasion = params.get("occasion");
const selectedPackage = params.get("package");


/* =========================
   PRESELECT OCCASION
========================= */

if (selectedOccasion) {

    const occasionCard =
        document.querySelector(
            `.occasion-selection .selection-card[data-value="${selectedOccasion}"]`
        );

    if (occasionCard) {

        document.querySelectorAll(
            ".occasion-selection .selection-card"
        ).forEach(card => {

            card.classList.remove("selected");

        });

        occasionCard.classList.add("selected");

        document.getElementById("occasion").value =
            selectedOccasion;

    }

}


/* =========================
   PRESELECT PACKAGE
========================= */

if (selectedPackage) {

    const packageCard =
        document.querySelector(
            `.package-option[data-value="${selectedPackage}"]`
        );

    if (packageCard) {

        document.querySelectorAll(
            ".package-option"
        ).forEach(card => {

            card.classList.remove("selected");

        });

        packageCard.classList.add("selected");

        document.getElementById("package").value =
            selectedPackage;

    }

}


/* =========================
   UPDATE STEP
========================= */

function showStep(step) {

    document.querySelectorAll(
        ".form-step"
    ).forEach(formStep => {

        formStep.classList.remove("active");

    });


    document.querySelector(
        `.form-step[data-step="${step}"]`
    ).classList.add("active");


    document.querySelectorAll(
        ".progress-step"
    ).forEach(progressStep => {

        const stepNumber =
            Number(
                progressStep.dataset.step
            );

        progressStep.classList.toggle(
            "active",
            stepNumber <= step
        );

    });


    const progress =
        ((step - 1) /
            (totalSteps - 1)) * 100;

    progressFill.style.width =
        `${progress}%`;


    prevBtn.style.display =
        step === 1 ? "none" : "flex";


    nextBtn.style.display =
        step === totalSteps ? "none" : "flex";


    submitBtn.style.display =
        step === totalSteps ? "flex" : "none";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================
   SELECTION CARDS
========================= */

function setupSelection(
    selector,
    inputId
) {

    const cards =
        document.querySelectorAll(selector);

    cards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                cards.forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });


                card.classList.add(
                    "selected"
                );


                document.getElementById(
                    inputId
                ).value =
                    card.dataset.value;

            }
        );

    });

}


setupSelection(
    ".occasion-selection .selection-card",
    "occasion"
);


setupSelection(
    ".relationship-selection .selection-card",
    "relationship"
);


setupSelection(
    ".theme-card",
    "theme"
);


setupSelection(
    ".package-option",
    "package"
);


/* =========================
   VALIDATE STEP
========================= */

function validateStep() {

    if (currentStep === 1) {

        if (
            !document.getElementById(
                "occasion"
            ).value
        ) {

            alert(
                "Please select an occasion 🎉"
            );

            return false;

        }

    }


    if (currentStep === 2) {

        if (
            !document.getElementById(
                "relationship"
            ).value
        ) {

            alert(
                "Please select who the celebration is for ❤️"
            );

            return false;

        }

    }


    if (currentStep === 3) {

        if (
            !document.getElementById(
                "theme"
            ).value
        ) {

            alert(
                "Please select a website theme 🎨"
            );

            return false;

        }

    }


    if (currentStep === 4) {

        const requiredInputs =
            document.querySelectorAll(
                `.form-step[data-step="4"] [required]`
            );

        for (const input of requiredInputs) {

            if (!input.value.trim()) {

                alert(
                    "Please fill all required details."
                );

                input.focus();

                return false;

            }

        }

    }


    if (currentStep === 5) {

        if (
            !document.getElementById(
                "package"
            ).value
        ) {

            alert(
                "Please select a package 💎"
            );

            return false;

        }

    }


    return true;

}


/* =========================
   NEXT BUTTON
========================= */

nextBtn.addEventListener(
    "click",
    () => {

        if (
            !validateStep()
        ) return;


        if (
            currentStep < totalSteps
        ) {

            currentStep++;

            showStep(
                currentStep
            );

        }

    }
);


/* =========================
   PREVIOUS BUTTON
========================= */

prevBtn.addEventListener(
    "click",
    () => {

        if (
            currentStep > 1
        ) {

            currentStep--;

            showStep(
                currentStep
            );

        }

    }
);


/* =========================
   PHOTO PREVIEW
========================= */

const photoInput =
    document.getElementById("photos");

const photoPreview =
    document.getElementById(
        "photoPreview"
    );


photoInput.addEventListener(
    "change",
    () => {

        photoPreview.innerHTML = "";

        const files =
            Array.from(
                photoInput.files
            );


        files.forEach(file => {

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) return;


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const image =
                        document.createElement(
                            "img"
                        );


                    image.src =
                        event.target.result;


                    image.classList.add(
                        "photo-preview"
                    );


                    photoPreview.appendChild(
                        image
                    );

                };


            reader.readAsDataURL(
                file
            );

        });

    }
);


/* =========================
   SAVE ORDER DATA
========================= */

form.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        if (!validateStep()) return;


        const celebrationData = {

            occasion:
                document.getElementById(
                    "occasion"
                ).value,

            relationship:
                document.getElementById(
                    "relationship"
                ).value,

            theme:
                document.getElementById(
                    "theme"
                ).value,

            personName:
                document.getElementById(
                    "personName"
                ).value,

            customerName:
                document.getElementById(
                    "customerName"
                ).value,

            specialDate:
                document.getElementById(
                    "specialDate"
                ).value,

            email:
                document.getElementById(
                    "email"
                ).value,

            message:
                document.getElementById(
                    "message"
                ).value,

            package:
                document.getElementById(
                    "package"
                ).value

        };


        /*
          Save temporarily
          in browser storage.
        */

        localStorage.setItem(
            "celebrateVerseOrder",
            JSON.stringify(
                celebrationData
            )
        );


        alert(
            "Great! 🎉 Your celebration details are ready. Continue to payment."
        );


        window.location.href =
            "payment.html";

    }
);
setupSelection(
    ".package-option",
    "package"
);
/* =========================
   PACKAGE SELECTION FIX
========================= */

document.querySelectorAll(
    ".package-option"
).forEach(packageCard => {

    packageCard.addEventListener(
        "click",
        () => {

            document.querySelectorAll(
                ".package-option"
            ).forEach(card => {

                card.classList.remove(
                    "selected"
                );

            });


            packageCard.classList.add(
                "selected"
            );


            const selectedPackage =
                packageCard.dataset.value;


            document.getElementById(
                "package"
            ).value =
                selectedPackage;


            console.log(
                "Selected package:",
                selectedPackage
            );

        }
    );

});
