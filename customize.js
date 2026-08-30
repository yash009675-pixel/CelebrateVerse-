document.addEventListener("DOMContentLoaded", () => {

    let currentStep = 1;
    const totalSteps = 5;

    const form = document.getElementById("celebrationForm");

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const submitBtn = document.getElementById("submitBtn");

    const progressFill =
        document.getElementById("progressFill");


    /* =========================
       URL PARAMETERS
    ========================= */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const selectedOccasion =
        params.get("occasion");

    const selectedPackage =
        params.get("package");


    /* =========================
       SHOW STEP
    ========================= */

    function showStep(step) {

        document.querySelectorAll(
            ".form-step"
        ).forEach(formStep => {

            formStep.classList.remove(
                "active"
            );

        });


        const activeStep =
            document.querySelector(
                `.form-step[data-step="${step}"]`
            );


        if (activeStep) {

            activeStep.classList.add(
                "active"
            );

        }


        document.querySelectorAll(
            ".progress-step"
        ).forEach(progressStep => {

            const stepNumber =
                Number(
                    progressStep.dataset.step
                );

            if (
                stepNumber <= step
            ) {

                progressStep.classList.add(
                    "active"
                );

            } else {

                progressStep.classList.remove(
                    "active"
                );

            }

        });


        const progress =
            ((step - 1) /
                (totalSteps - 1)) * 100;


        if (progressFill) {

            progressFill.style.width =
                `${progress}%`;

        }


        if (prevBtn) {

            prevBtn.style.display =
                step === 1
                    ? "none"
                    : "flex";

        }


        if (nextBtn) {

            nextBtn.style.display =
                step === totalSteps
                    ? "none"
                    : "flex";

        }


        if (submitBtn) {

            submitBtn.style.display =
                step === totalSteps
                    ? "flex"
                    : "none";

        }


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    /* =========================
       GENERAL SELECTION SYSTEM
    ========================= */

    function setupSelection(
        selector,
        inputId
    ) {

        const cards =
            document.querySelectorAll(
                selector
            );


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


                    const hiddenInput =
                        document.getElementById(
                            inputId
                        );


                    if (hiddenInput) {

                        hiddenInput.value =
                            card.dataset.value;

                    }


                    console.log(
                        inputId + " selected:",
                        card.dataset.value
                    );

                }
            );

        });

    }


    /* =========================
       SETUP SELECTIONS
    ========================= */

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
       PRESELECT OCCASION
    ========================= */

    if (selectedOccasion) {

        const occasionInput =
            document.getElementById(
                "occasion"
            );


        if (occasionInput) {

            occasionInput.value =
                selectedOccasion;

        }


        const occasionCard =
            document.querySelector(
                `.occasion-selection .selection-card[data-value="${selectedOccasion}"]`
            );


        if (occasionCard) {

            document.querySelectorAll(
                ".occasion-selection .selection-card"
            ).forEach(card => {

                card.classList.remove(
                    "selected"
                );

            });


            occasionCard.classList.add(
                "selected"
            );

        }

    }


    /* =========================
       PRESELECT PACKAGE
    ========================= */

    if (selectedPackage) {

        const packageInput =
            document.getElementById(
                "package"
            );


        if (packageInput) {

            packageInput.value =
                selectedPackage;

        }


        const packageCard =
            document.querySelector(
                `.package-option[data-value="${selectedPackage}"]`
            );


        if (packageCard) {

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

        }

    }


    /* =========================
       VALIDATE STEP
    ========================= */

    function validateStep() {

        if (currentStep === 1) {

            const occasion =
                document.getElementById(
                    "occasion"
                ).value;


            if (!occasion) {

                alert(
                    "Please select an occasion 🎉"
                );

                return false;

            }

        }


        if (currentStep === 2) {

            const relationship =
                document.getElementById(
                    "relationship"
                ).value;


            if (!relationship) {

                alert(
                    "Please select who the celebration is for ❤️"
                );

                return false;

            }

        }


        if (currentStep === 3) {

            const theme =
                document.getElementById(
                    "theme"
                ).value;


            if (!theme) {

                alert(
                    "Please select a website theme 🎨"
                );

                return false;

            }

        }


        if (currentStep === 4) {

            const requiredInputs =
                document.querySelectorAll(
                    '.form-step[data-step="4"] [required]'
                );


            for (
                const input
                of requiredInputs
            ) {

                if (
                    !input.value.trim()
                ) {

                    alert(
                        "Please fill all required details."
                    );

                    input.focus();

                    return false;

                }

            }

        }


        if (currentStep === 5) {

            const selectedPackageValue =
                document.getElementById(
                    "package"
                ).value;


            console.log(
                "Package before payment:",
                selectedPackageValue
            );


            if (
                !selectedPackageValue
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

    if (nextBtn) {

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

    }


    /* =========================
       PREVIOUS BUTTON
    ========================= */

    if (prevBtn) {

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

    }


    /* =========================
       PHOTO PREVIEW
    ========================= */

    const photoInput =
        document.getElementById(
            "photos"
        );


    const photoPreview =
        document.getElementById(
            "photoPreview"
        );


    if (
        photoInput &&
        photoPreview
    ) {

        photoInput.addEventListener(
            "change",
            () => {

                photoPreview.innerHTML =
                    "";


                const files =
                    Array.from(
                        photoInput.files
                    );


                files.forEach(file => {

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        return;

                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        event => {

                            const image =
                                document.createElement(
                                    "img"
                                );


                            image.src =
                                event.target.result;


                            image.className =
                                "photo-preview";


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

    }


    /* =========================
       SAVE ORDER
    ========================= */

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (
                !validateStep()
            ) {

                return;

            }


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


            console.log(
                "Saving order:",
                celebrationData
            );


            localStorage.setItem(
                "celebrateVerseOrder",
                JSON.stringify(
                    celebrationData
                )
            );


            window.location.href =
                "payment.html";

        }
    );


    /* =========================
       START PAGE
    ========================= */

    showStep(1);

});
