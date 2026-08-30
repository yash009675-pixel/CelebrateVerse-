document.addEventListener("DOMContentLoaded", () => {

    let currentStep = 1;
    const totalSteps = 5;

    const form =
        document.getElementById("celebrationForm");

    const nextBtn =
        document.getElementById("nextBtn");

    const prevBtn =
        document.getElementById("prevBtn");

    const submitBtn =
        document.getElementById("submitBtn");

    const progressFill =
        document.getElementById("progressFill");


    /* =========================
       SHOW STEP
    ========================= */

    function showStep(step) {

        document
            .querySelectorAll(".form-step")
            .forEach(item => {

                item.classList.remove("active");

            });


        const activeStep =
            document.querySelector(
                `.form-step[data-step="${step}"]`
            );


        if (activeStep) {

            activeStep.classList.add("active");

        }


        document
            .querySelectorAll(".progress-step")
            .forEach(item => {

                const stepNumber =
                    Number(item.dataset.step);


                if (stepNumber <= step) {

                    item.classList.add("active");

                } else {

                    item.classList.remove("active");

                }

            });


        if (progressFill) {

            const progress =
                ((step - 1) /
                    (totalSteps - 1)) * 100;

            progressFill.style.width =
                progress + "%";

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

    }


    /* =========================
       CARD SELECTION
    ========================= */

    function setupSelection(selector, inputId) {

        const cards =
            document.querySelectorAll(selector);

        const hiddenInput =
            document.getElementById(inputId);


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


                    if (hiddenInput) {

                        hiddenInput.value =
                            card.dataset.value;

                    }


                    /* PACKAGE BACKUP */

                    if (inputId === "package") {

                        localStorage.setItem(
                            "celebrateVerseSelectedPackage",
                            card.dataset.value
                        );

                    }


                    console.log(
                        "Selected:",
                        inputId,
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
       NEXT BUTTON
    ========================= */

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            () => {


                if (!validateStep()) {

                    return;

                }


                if (currentStep < totalSteps) {

                    currentStep++;

                    showStep(currentStep);

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

                if (currentStep > 1) {

                    currentStep--;

                    showStep(currentStep);

                }

            }
        );

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

            const personName =
                document.getElementById(
                    "personName"
                ).value.trim();


            const customerName =
                document.getElementById(
                    "customerName"
                ).value.trim();


            const specialDate =
                document.getElementById(
                    "specialDate"
                ).value;


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            if (
                !personName ||
                !customerName ||
                !specialDate ||
                !email
            ) {

                alert(
                    "Please fill all required details."
                );

                return false;

            }

        }


        if (currentStep === 5) {

            const packageInput =
                document.getElementById(
                    "package"
                );


            if (!packageInput.value) {

                alert(
                    "Please select a package 💎"
                );

                return false;

            }

        }


        return true;

    }


    /* =========================
       PHOTO PREVIEW
    ========================= */

    const photoInput =
        document.getElementById("photos");


    const photoPreview =
        document.getElementById(
            "photoPreview"
        );


    if (photoInput && photoPreview) {

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


                    reader.readAsDataURL(file);

                });


            }
        );

    }


    /* =========================
       SUBMIT ORDER
    ========================= */

    if (form) {

        form.addEventListener(
            "submit",
            event => {


                event.preventDefault();


                if (!validateStep()) {

                    return;

                }


                const selectedPackage =
                    document.getElementById(
                        "package"
                    ).value;


                /* PACKAGE SAFETY CHECK */

                const validPackages =
                    [
                        "basic",
                        "premium",
                        "ultimate"
                    ];


                if (
                    !validPackages.includes(
                        selectedPackage
                    )
                ) {

                    alert(
                        "Please select a valid package."
                    );

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
                        ).value.trim(),


                    customerName:
                        document.getElementById(
                            "customerName"
                        ).value.trim(),


                    specialDate:
                        document.getElementById(
                            "specialDate"
                        ).value,


                    email:
                        document.getElementById(
                            "email"
                        ).value.trim(),


                    message:
                        document.getElementById(
                            "message"
                        ).value.trim(),


                    package:
                        selectedPackage

                };


                /* SAVE PACKAGE */

                localStorage.setItem(
                    "celebrateVerseSelectedPackage",
                    selectedPackage
                );


                /* SAVE COMPLETE ORDER */

                localStorage.setItem(
                    "celebrateVerseOrder",
                    JSON.stringify(
                        celebrationData
                    )
                );


                console.log(
                    "ORDER SAVED:",
                    celebrationData
                );


                window.location.href =
                    "payment.html";


            }
        );

    }


    showStep(currentStep);

});
