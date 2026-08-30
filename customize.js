document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       BASIC SETTINGS
    ========================= */

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
       CHECK FORM
    ========================= */

    if (!form) {

        console.error(
            "celebrationForm not found"
        );

        return;

    }


    /* =========================
       URL PARAMETERS
    ========================= */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const selectedOccasion =
        params.get(
            "occasion"
        );


    const selectedPackage =
        params.get(
            "package"
        );


    /* =========================
       SHOW CURRENT STEP
    ========================= */

    function showStep(step) {

        document
            .querySelectorAll(
                ".form-step"
            )
            .forEach(
                formStep => {

                    formStep.classList.remove(
                        "active"
                    );

                }
            );


        const activeStep =
            document.querySelector(
                `.form-step[data-step="${step}"]`
            );


        if (activeStep) {

            activeStep.classList.add(
                "active"
            );

        }


        /* Progress Steps */

        document
            .querySelectorAll(
                ".progress-step"
            )
            .forEach(
                progressStep => {

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

                }
            );


        /* Progress Bar */

        const progress =
            (
                (step - 1) /
                (totalSteps - 1)
            ) * 100;


        if (progressFill) {

            progressFill.style.width =
                `${progress}%`;

        }


        /* Previous Button */

        if (prevBtn) {

            prevBtn.style.display =
                step === 1
                    ? "none"
                    : "flex";

        }


        /* Next Button */

        if (nextBtn) {

            nextBtn.style.display =
                step === totalSteps
                    ? "none"
                    : "flex";

        }


        /* Submit Button */

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
       GENERAL CARD SELECTION
    ========================= */

    function setupSelection(
        selector,
        inputId
    ) {

        const cards =
            document.querySelectorAll(
                selector
            );


        cards.forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        /* Remove Previous Selection */

                        cards.forEach(
                            item => {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                        /* Add New Selection */

                        card.classList.add(
                            "selected"
                        );


                        /* Hidden Input */

                        const hiddenInput =
                            document.getElementById(
                                inputId
                            );


                        if (!hiddenInput) {

                            console.error(
                                `${inputId} input not found`
                            );

                            return;

                        }


                        /* Get Value */

                        let value =
                            card.dataset.value ||
                            card.dataset.package ||
                            "";


                        /*
                           Extra fallback
                        */

                        if (!value) {

                            value =
                                card.getAttribute(
                                    "data-value"
                                ) || "";

                        }


                        hiddenInput.value =
                            value
                                .toLowerCase()
                                .trim();


                        console.log(
                            `${inputId} selected:`,
                            hiddenInput.value
                        );

                    }
                );

            }
        );

    }


    /* =========================
       OCCASION SELECTION
    ========================= */

    setupSelection(
        ".occasion-selection .selection-card",
        "occasion"
    );


    /* =========================
       RELATIONSHIP SELECTION
    ========================= */

    setupSelection(
        ".relationship-selection .selection-card",
        "relationship"
    );


    /* =========================
       THEME SELECTION
    ========================= */

    setupSelection(
        ".theme-card",
        "theme"
    );


    /* =========================
       PACKAGE SELECTION
    ========================= */

    const packageCards =
        document.querySelectorAll(
            ".package-option"
        );


    const packageInput =
        document.getElementById(
            "package"
        );


    packageCards.forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    /* Remove Previous Selection */

                    packageCards.forEach(
                        item => {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    /* Select Current Package */

                    card.classList.add(
                        "selected"
                    );


                    /* Get Package Value */

                    let packageValue =
                        card.dataset.value ||
                        card.dataset.package ||
                        "";


                    /*
                       If data-value is missing,
                       detect package from text
                    */

                    if (!packageValue) {

                        const cardText =
                            card.textContent
                                .toLowerCase();


                        if (
                            cardText.includes(
                                "basic"
                            )
                        ) {

                            packageValue =
                                "basic";

                        }


                        else if (
                            cardText.includes(
                                "premium"
                            )
                        ) {

                            packageValue =
                                "premium";

                        }


                        else if (
                            cardText.includes(
                                "ultimate"
                            )
                        ) {

                            packageValue =
                                "ultimate";

                        }

                    }


                    /* Save Package */

                    if (packageInput) {

                        packageInput.value =
                            String(
                                packageValue
                            )
                                .toLowerCase()
                                .trim();


                        console.log(
                            "PACKAGE SELECTED:",
                            packageInput.value
                        );


                        console.log(
                            "PACKAGE CARD:",
                            card
                        );

                    }


                }
            );

        }
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
                selectedOccasion
                    .toLowerCase()
                    .trim();

        }


        const occasionCard =
            document.querySelector(
                `.occasion-selection .selection-card[data-value="${selectedOccasion}"]`
            );


        if (occasionCard) {

            document
                .querySelectorAll(
                    ".occasion-selection .selection-card"
                )
                .forEach(
                    card => {

                        card.classList.remove(
                            "selected"
                        );

                    }
                );


            occasionCard.classList.add(
                "selected"
            );

        }

    }


    /* =========================
       PRESELECT PACKAGE
    ========================= */

    if (selectedPackage) {

        const normalizedPackage =
            selectedPackage
                .toLowerCase()
                .trim();


        if (packageInput) {

            packageInput.value =
                normalizedPackage;

        }


        packageCards.forEach(
            card => {

                let cardValue =
                    card.dataset.value ||
                    card.dataset.package ||
                    "";


                if (
                    cardValue
                        .toLowerCase()
                        .trim() ===
                    normalizedPackage
                ) {

                    packageCards.forEach(
                        item => {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    card.classList.add(
                        "selected"
                    );

                }

            }
        );

    }


    /* =========================
       VALIDATE STEP
    ========================= */

    function validateStep() {

        /* STEP 1 */

        if (currentStep === 1) {

            const occasionInput =
                document.getElementById(
                    "occasion"
                );


            const occasion =
                occasionInput
                    ? occasionInput.value.trim()
                    : "";


            if (!occasion) {

                alert(
                    "Please select an occasion 🎉"
                );

                return false;

            }

        }


        /* STEP 2 */

        if (currentStep === 2) {

            const relationshipInput =
                document.getElementById(
                    "relationship"
                );


            const relationship =
                relationshipInput
                    ? relationshipInput.value.trim()
                    : "";


            if (!relationship) {

                alert(
                    "Please select who the celebration is for ❤️"
                );

                return false;

            }

        }


        /* STEP 3 */

        if (currentStep === 3) {

            const themeInput =
                document.getElementById(
                    "theme"
                );


            const theme =
                themeInput
                    ? themeInput.value.trim()
                    : "";


            if (!theme) {

                alert(
                    "Please select a website theme 🎨"
                );

                return false;

            }

        }


        /* STEP 4 */

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


        /* STEP 5 */

        if (currentStep === 5) {

            const selectedPackageValue =
                packageInput
                    ? packageInput.value
                        .toLowerCase()
                        .trim()
                    : "";


            console.log(
                "FINAL PACKAGE:",
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


            /*
               Check valid package
            */

            const validPackages =
                [
                    "basic",
                    "premium",
                    "ultimate"
                ];


            if (
                !validPackages.includes(
                    selectedPackageValue
                )
            ) {

                alert(
                    "Invalid package selected. Please select again."
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
                ) {

                    return;

                }


                if (
                    currentStep <
                    totalSteps
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


                files.forEach(
                    file => {

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

                    }
                );

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


            /* Get Package Safely */

            const finalPackage =
                packageInput
                    ? packageInput.value
                        .toLowerCase()
                        .trim()
                    : "";


            const celebrationData = {

                occasion:
                    document.getElementById(
                        "occasion"
                    )?.value || "",


                relationship:
                    document.getElementById(
                        "relationship"
                    )?.value || "",


                theme:
                    document.getElementById(
                        "theme"
                    )?.value || "",


                personName:
                    document.getElementById(
                        "personName"
                    )?.value || "",


                customerName:
                    document.getElementById(
                        "customerName"
                    )?.value || "",


                specialDate:
                    document.getElementById(
                        "specialDate"
                    )?.value || "",


                email:
                    document.getElementById(
                        "email"
                    )?.value || "",


                message:
                    document.getElementById(
                        "message"
                    )?.value || "",


                package:
                    finalPackage

            };


            console.log(
                "FINAL ORDER DATA:",
                celebrationData
            );


            /* Check Package Again */

            if (
                !celebrationData.package
            ) {

                alert(
                    "Package was not saved. Please select your package again."
                );

                return;

            }


            /* Save To LocalStorage */

            localStorage.setItem(
                "celebrateVerseOrder",
                JSON.stringify(
                    celebrationData
                )
            );


            console.log(
                "ORDER SAVED SUCCESSFULLY"
            );


            console.log(
                localStorage.getItem(
                    "celebrateVerseOrder"
                )
            );


            /* Go To Payment */

            window.location.href =
                "payment.html";

        }
    );


    /* =========================
       START PAGE
    ========================= */

    showStep(
        currentStep
    );

});
