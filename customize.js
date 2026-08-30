document.addEventListener("DOMContentLoaded", () => {

    let currentStep = 1;

    const totalSteps = 5;


    const form =
        document.getElementById(
            "celebrationForm"
        );


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    const prevBtn =
        document.getElementById(
            "prevBtn"
        );


    const submitBtn =
        document.getElementById(
            "submitBtn"
        );


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    /* =========================
       SHOW STEP
    ========================= */

    function showStep(step) {

        document
            .querySelectorAll(".form-step")
            .forEach(item => {

                item.classList.remove(
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


        document
            .querySelectorAll(".progress-step")
            .forEach(item => {

                const itemStep =
                    Number(
                        item.dataset.step
                    );


                if (itemStep <= step) {

                    item.classList.add(
                        "active"
                    );

                } else {

                    item.classList.remove(
                        "active"
                    );

                }

            });


        if (progressFill) {

            const progress =
                ((step - 1) /
                    (totalSteps - 1))
                * 100;


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

    function setupSelection(
        selector,
        inputId
    ) {

        const cards =
            document.querySelectorAll(
                selector
            );


        const hiddenInput =
            document.getElementById(
                inputId
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


                    if (hiddenInput) {

                        hiddenInput.value =
                            card.dataset.value;

                    }


                    console.log(
                        inputId,
                        "=",
                        card.dataset.value
                    );


                    /* SAVE PACKAGE IMMEDIATELY */

                    if (
                        inputId === "package"
                    ) {

                        localStorage.setItem(
                            "celebrateVerseSelectedPackage",
                            card.dataset.value
                        );

                    }


                }
            );

        });

    }



    /* =========================
       SETUP ALL SELECTIONS
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
       VALIDATE STEP
    ========================= */

    function validateStep() {


        if (currentStep === 1) {

            const value =
                document.getElementById(
                    "occasion"
                ).value;


            if (!value) {

                alert(
                    "Please select an occasion 🎉"
                );

                return false;

            }

        }



        if (currentStep === 2) {

            const value =
                document.getElementById(
                    "relationship"
                ).value;


            if (!value) {

                alert(
                    "Please select who the celebration is for ❤️"
                );

                return false;

            }

        }



        if (currentStep === 3) {

            const value =
                document.getElementById(
                    "theme"
                ).value;


            if (!value) {

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


            let selectedPackage =
                packageInput.value;


            /* BACKUP PACKAGE */

            if (!selectedPackage) {

                selectedPackage =
                    localStorage.getItem(
                        "celebrateVerseSelectedPackage"
                    ) || "";

            }


            if (!selectedPackage) {

                alert(
                    "Please select a package 💎"
                );

                return false;

            }


            packageInput.value =
                selectedPackage;

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


                if (!validateStep()) {

                    return;

                }


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


                /* GET PACKAGE */

                const packageValue =
                    document.getElementById(
                        "package"
                    ).value;


                /* CREATE ORDER */

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
                        packageValue

                };


                /* DEBUG */

                console.log(
                    "FINAL ORDER:",
                    celebrationData
                );


                /* SAVE COMPLETE ORDER */

                localStorage.setItem(
                    "celebrateVerseOrder",
                    JSON.stringify(
                        celebrationData
                    )
                );


                /* REDIRECT */

                window.location.href =
                    "payment.html";


            }
        );

    }



    /* =========================
       START
    ========================= */

    showStep(
        currentStep
    );

});
