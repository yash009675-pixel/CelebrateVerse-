document.addEventListener("DOMContentLoaded", () => {

    let currentStep = 1;
    const totalSteps = 5;

    const form = document.getElementById("celebrationForm");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const submitBtn = document.getElementById("submitBtn");
    const progressFill = document.getElementById("progressFill");


    /* =========================
       SHOW STEP
    ========================= */

    function showStep(step) {

        document.querySelectorAll(".form-step").forEach(item => {
            item.classList.remove("active");
        });

        const activeStep = document.querySelector(
            `.form-step[data-step="${step}"]`
        );

        if (activeStep) {
            activeStep.classList.add("active");
        }


        document.querySelectorAll(".progress-step").forEach(item => {

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
                ((step - 1) / (totalSteps - 1)) * 100;

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

            card.addEventListener("click", () => {

                cards.forEach(item => {
                    item.classList.remove("selected");
                });


                card.classList.add("selected");


                if (hiddenInput) {

                    hiddenInput.value =
                        card.dataset.value;

                    console.log(
                        inputId + " selected:",
                        hiddenInput.value
                    );

                }

            });

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
       VALIDATE CURRENT STEP
    ========================= */

    function validateStep() {

        if (currentStep === 1) {

            const value =
                document.getElementById("occasion").value;

            if (!value) {

                alert("Please select an occasion 🎉");

                return false;

            }

        }


        if (currentStep === 2) {

            const value =
                document.getElementById("relationship").value;

            if (!value) {

                alert(
                    "Please select who the celebration is for ❤️"
                );

                return false;

            }

        }


        if (currentStep === 3) {

            const value =
                document.getElementById("theme").value;

            if (!value) {

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

            const selectedCard =
                document.querySelector(
                    ".package-option.selected"
                );


            const packageInput =
                document.getElementById("package");


            /* FORCE PACKAGE VALUE */

            if (
                selectedCard &&
                selectedCard.dataset.value
            ) {

                packageInput.value =
                    selectedCard.dataset.value;

            }


            if (
                !packageInput ||
                !packageInput.value
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

                if (!validateStep()) {
                    return;
                }


                if (
                    currentStep < totalSteps
                ) {

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
       PHOTO PREVIEW
    ========================= */

    const photoInput =
        document.getElementById("photos");

    const photoPreview =
        document.getElementById("photoPreview");


    if (
        photoInput &&
        photoPreview
    ) {

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
       SAVE ORDER
    ========================= */

    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                /* FORCE PACKAGE DETECTION */

                const selectedPackageCard =
                    document.querySelector(
                        ".package-option.selected"
                    );


                const packageInput =
                    document.getElementById("package");


                if (
                    selectedPackageCard &&
                    selectedPackageCard.dataset.value
                ) {

                    packageInput.value =
                        selectedPackageCard.dataset.value;

                }


                const selectedPackage =
                    packageInput
                        ? packageInput.value
                        : "";


                console.log(
                    "FINAL PACKAGE:",
                    selectedPackage
                );


                if (!selectedPackage) {

                    alert(
                        "Please select a package 💎"
                    );

                    return;

                }


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

                    /* IMPORTANT */

                    package:
                        selectedPackage

                };


                console.log(
                    "SAVING FULL ORDER:",
                    celebrationData
                );


                /* CLEAR OLD DATA FIRST */

                localStorage.removeItem(
                    "celebrateVerseOrder"
                );


                /* SAVE NEW DATA */

                localStorage.setItem(
                    "celebrateVerseOrder",
                    JSON.stringify(
                        celebrationData
                    )
                );


                /* VERIFY SAVED DATA */

                const verifyOrder =
                    localStorage.getItem(
                        "celebrateVerseOrder"
                    );


                console.log(
                    "VERIFIED SAVED ORDER:",
                    verifyOrder
                );


                /* GO TO PAYMENT */

                const finalPackage =
    String(selectedPackage)
        .trim()
        .toLowerCase();

console.log("GOING TO PAYMENT WITH:", finalPackage);

window.location.href =
    "payment.html?package=" +
    encodeURIComponent(finalPackage);

            }
        );

    }


    /* =========================
       START
    ========================= */

    showStep(1);

});
/* ==========================================
   PHASE TWO - AUTO SAVE CUSTOMIZATION DATA
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const AUTO_SAVE_KEY =
        "celebrateVerseCustomization";


    const formFields =
        document.querySelectorAll(
            "input, textarea, select"
        );


    /* Restore previously saved values */

    const savedData =
        JSON.parse(
            localStorage.getItem(
                AUTO_SAVE_KEY
            ) || "{}"
        );


    formFields.forEach(field => {

        const fieldKey =
            field.name ||
            field.id;


        if (
            !fieldKey
        ) {

            return;

        }


        if (
            savedData[fieldKey] !==
            undefined
        ) {

            if (
                field.type ===
                "checkbox"
            ) {

                field.checked =
                    savedData[fieldKey];

            } else {

                field.value =
                    savedData[fieldKey];

            }

        }

    });


    /* Save all field changes */

    function saveCustomization() {

        const data = {};


        formFields.forEach(field => {

            const fieldKey =
                field.name ||
                field.id;


            if (
                !fieldKey
            ) {

                return;

            }


            if (
                field.type ===
                "file"
            ) {

                return;

            }


            if (
                field.type ===
                "checkbox"
            ) {

                data[fieldKey] =
                    field.checked;

            } else {

                data[fieldKey] =
                    field.value;

            }

        });


        localStorage.setItem(
            AUTO_SAVE_KEY,
            JSON.stringify(data)
        );

    }


    /* Listen for changes */

    formFields.forEach(field => {

        field.addEventListener(
            "input",
            saveCustomization
        );


        field.addEventListener(
            "change",
            saveCustomization
        );

    });


    /* Optional success feedback */

    let saveTimer;


    formFields.forEach(field => {

        field.addEventListener(
            "input",
            () => {

                clearTimeout(
                    saveTimer
                );


                saveTimer =
                    setTimeout(
                        () => {

                            if (
                                typeof showToast ===
                                "function"
                            ) {

                                showToast(
                                    "Changes saved automatically 💾",
                                    "info",
                                    1800
                                );

                            }

                        },
                        1200
                    );

            }
        );

    });


    /* Make function available globally */

    window.clearCustomizationData =
        function () {

            localStorage.removeItem(
                AUTO_SAVE_KEY
            );


            if (
                typeof showToast ===
                "function"
            ) {

                showToast(
                    "Saved customization cleared.",
                    "info"
                );

            }

        };

});
    /* ==========================================
       LOAD SAVED DATA INTO LIVE PREVIEW
    ========================================== */

    function refreshLivePreview() {

        const savedCustomization =
            JSON.parse(
                localStorage.getItem(
                    "celebrateVerseCustomization"
                ) || "{}"
            );


        if (
            savedCustomization.occasion &&
            previewOccasion
        ) {

            const value =
                savedCustomization.occasion;

            previewOccasion.textContent =
                value.charAt(0).toUpperCase() +
                value.slice(1);

        }


        if (
            savedCustomization.relationship &&
            previewRelationship
        ) {

            const value =
                savedCustomization.relationship;

            previewRelationship.textContent =
                value
                    .replace("-", " ")
                    .replace(
                        /\b\w/g,
                        letter =>
                            letter.toUpperCase()
                    );

        }


        if (
            savedCustomization.personName &&
            previewName
        ) {

            previewName.textContent =
                savedCustomization.personName;

        }


        if (
            savedCustomization.message &&
            previewMessage
        ) {

            previewMessage.textContent =
                savedCustomization.message;

        }


        if (
            savedCustomization.specialDate &&
            previewDate
        ) {

            const date =
                new Date(
                    savedCustomization.specialDate
                );


            previewDate.textContent =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );

        }


        if (
            savedCustomization.theme &&
            previewTheme
        ) {

            const theme =
                savedCustomization.theme;

            previewTheme.textContent =
                theme.charAt(0).toUpperCase() +
                theme.slice(1);


            const previewCard =
                document.querySelector(
                    ".live-preview-card"
                );


            if (previewCard) {

                previewCard.className =
                    "live-preview-card " +
                    theme +
                    "-preview";

            }

        }

    }


    refreshLivePreview();
/* ==========================================
   CELEBRATEVERSE LIVE PREVIEW SYSTEM
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* Preview Elements */

    const previewOccasion =
        document.getElementById("previewOccasion");

    const previewRelationship =
        document.getElementById("previewRelationship");

    const previewName =
        document.getElementById("previewName");

    const previewMessage =
        document.getElementById("previewMessage");

    const previewTheme =
        document.getElementById("previewTheme");

    const previewDate =
        document.getElementById("previewDate");


    /* ==========================================
       OCCASION LIVE UPDATE
    ========================================== */

    document
        .querySelectorAll(
            ".occasion-selection .selection-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const value =
                        card.dataset.value;


                    if (previewOccasion) {

                        previewOccasion.textContent =
                            value
                                .charAt(0)
                                .toUpperCase() +
                            value.slice(1);

                    }

                }
            );

        });


    /* ==========================================
       RELATIONSHIP LIVE UPDATE
    ========================================== */

    document
        .querySelectorAll(
            ".relationship-selection .selection-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const value =
                        card.dataset.value;


                    if (previewRelationship) {

                        previewRelationship.textContent =
                            value
                                .replace("-", " ")
                                .replace(
                                    /\b\w/g,
                                    letter =>
                                        letter.toUpperCase()
                                );

                    }

                }
            );

        });


    /* ==========================================
       NAME LIVE UPDATE
    ========================================== */

    const personNameInput =
        document.getElementById(
            "personName"
        );


    if (personNameInput) {

        personNameInput.addEventListener(
            "input",
            () => {

                if (previewName) {

                    previewName.textContent =
                        personNameInput.value ||
                        "Someone Special";

                }

            }
        );

    }


    /* ==========================================
       MESSAGE LIVE UPDATE
    ========================================== */

    const messageInput =
        document.getElementById(
            "message"
        );


    if (messageInput) {

        messageInput.addEventListener(
            "input",
            () => {

                if (previewMessage) {

                    previewMessage.textContent =
                        messageInput.value ||
                        "Your beautiful message will appear here...";

                }

            }
        );

    }


    /* ==========================================
       DATE LIVE UPDATE
    ========================================== */

    const specialDateInput =
        document.getElementById(
            "specialDate"
        );


    if (specialDateInput) {

        specialDateInput.addEventListener(
            "change",
            () => {

                if (
                    specialDateInput.value &&
                    previewDate
                ) {

                    const date =
                        new Date(
                            specialDateInput.value
                        );


                    previewDate.textContent =
                        date.toLocaleDateString(
                            "en-IN",
                            {
                                day:
                                    "numeric",

                                month:
                                    "long",

                                year:
                                    "numeric"
                            }
                        );

                }

            }
        );

    }


    /* ==========================================
       THEME LIVE UPDATE
    ========================================== */

    document
        .querySelectorAll(
            ".theme-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const theme =
                        card.dataset.value;


                    if (previewTheme) {

                        previewTheme.textContent =
                            theme
                                .charAt(0)
                                .toUpperCase() +
                            theme.slice(1);

                    }


                    const previewCard =
                        document.querySelector(
                            ".live-preview-card"
                        );


                    if (previewCard) {

                        previewCard.className =
                            "live-preview-card " +
                            theme +
                            "-preview";

                    }

                }
            );

        });


});
