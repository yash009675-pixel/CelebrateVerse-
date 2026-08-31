document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       CELEBRATEVERSE CUSTOMIZER SYSTEM
    ========================================== */

    let currentStep = 1;

    const totalSteps = 5;


    /* ==========================================
       MAIN ELEMENTS
    ========================================== */

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


    /* ==========================================
       FORM INPUTS
    ========================================== */

    const occasionInput =
        document.getElementById(
            "occasion"
        );

    const relationshipInput =
        document.getElementById(
            "relationship"
        );

    const themeInput =
        document.getElementById(
            "theme"
        );

    const packageInput =
        document.getElementById(
            "package"
        );

    const personNameInput =
        document.getElementById(
            "personName"
        );

    const customerNameInput =
        document.getElementById(
            "customerName"
        );

    const specialDateInput =
        document.getElementById(
            "specialDate"
        );

    const emailInput =
        document.getElementById(
            "email"
        );

    const messageInput =
        document.getElementById(
            "message"
        );

    const photoInput =
        document.getElementById(
            "photos"
        );

    const photoPreview =
        document.getElementById(
            "photoPreview"
        );


    /* ==========================================
       LIVE PREVIEW ELEMENTS
    ========================================== */

    const livePreview =
        document.getElementById(
            "celebrationLivePreview"
        );

    const previewOccasion =
        document.getElementById(
            "previewOccasion"
        );

    const previewEmoji =
        document.getElementById(
            "previewEmoji"
        );

    const previewPersonName =
        document.getElementById(
            "previewPersonName"
        );

    const previewRelationship =
        document.getElementById(
            "previewRelationship"
        );

    const previewMessage =
        document.getElementById(
            "previewMessage"
        );

    const previewPhotos =
        document.getElementById(
            "previewPhotos"
        );

    const previewPackage =
        document.getElementById(
            "previewPackage"
        );


    /* ==========================================
       AUTO SAVE KEY
    ========================================== */

    const AUTO_SAVE_KEY =
        "celebrateVerseCustomization";


    /* ==========================================
       FORMAT TEXT
    ========================================== */

    function formatText(value) {

        if (!value) {

            return "";

        }


        return value
            .replace(
                /-/g,
                " "
            )
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );

    }


    /* ==========================================
       GET OCCASION EMOJI
    ========================================== */

    function getOccasionEmoji(occasion) {

        const emojis = {

            birthday:
                "🎂",

            anniversary:
                "❤️",

            surprise:
                "🎁",

            wedding:
                "💍",

            family:
                "👨‍👩‍👧",

            custom:
                "✨"

        };


        return emojis[
            occasion
        ] || "🎉";

    }


    /* ==========================================
       SAVE CUSTOMIZATION
    ========================================== */

    function saveCustomization() {

        const data = {

            occasion:
                occasionInput
                    ? occasionInput.value
                    : "",

            relationship:
                relationshipInput
                    ? relationshipInput.value
                    : "",

            theme:
                themeInput
                    ? themeInput.value
                    : "",

            package:
                packageInput
                    ? packageInput.value
                    : "",

            personName:
                personNameInput
                    ? personNameInput.value
                    : "",

            customerName:
                customerNameInput
                    ? customerNameInput.value
                    : "",

            specialDate:
                specialDateInput
                    ? specialDateInput.value
                    : "",

            email:
                emailInput
                    ? emailInput.value
                    : "",

            message:
                messageInput
                    ? messageInput.value
                    : ""

        };


        localStorage.setItem(

            AUTO_SAVE_KEY,

            JSON.stringify(
                data
            )

        );

    }


    /* ==========================================
       RESTORE SAVED DATA
    ========================================== */

    function restoreCustomization() {

        let savedData = {};


        try {

            savedData =
                JSON.parse(
                    localStorage.getItem(
                        AUTO_SAVE_KEY
                    ) || "{}"
                );

        } catch (error) {

            savedData = {};

        }


        if (
            occasionInput &&
            savedData.occasion
        ) {

            occasionInput.value =
                savedData.occasion;

        }


        if (
            relationshipInput &&
            savedData.relationship
        ) {

            relationshipInput.value =
                savedData.relationship;

        }


        if (
            themeInput &&
            savedData.theme
        ) {

            themeInput.value =
                savedData.theme;

        }


        if (
            packageInput &&
            savedData.package
        ) {

            packageInput.value =
                savedData.package;

        }


        if (
            personNameInput &&
            savedData.personName
        ) {

            personNameInput.value =
                savedData.personName;

        }


        if (
            customerNameInput &&
            savedData.customerName
        ) {

            customerNameInput.value =
                savedData.customerName;

        }


        if (
            specialDateInput &&
            savedData.specialDate
        ) {

            specialDateInput.value =
                savedData.specialDate;

        }


        if (
            emailInput &&
            savedData.email
        ) {

            emailInput.value =
                savedData.email;

        }


        if (
            messageInput &&
            savedData.message
        ) {

            messageInput.value =
                savedData.message;

        }


        /* Restore selected cards */

        restoreSelectedCard(

            ".occasion-selection .selection-card",

            savedData.occasion

        );


        restoreSelectedCard(

            ".relationship-selection .selection-card",

            savedData.relationship

        );


        restoreSelectedCard(

            ".theme-card",

            savedData.theme

        );


        restoreSelectedCard(

            ".package-option",

            savedData.package

        );

    }


    /* ==========================================
       RESTORE SELECTED CARD
    ========================================== */

    function restoreSelectedCard(
        selector,
        value
    ) {

        if (!value) {

            return;

        }


        document
            .querySelectorAll(
                selector
            )
            .forEach(card => {

                if (
                    card.dataset.value ===
                    value
                ) {

                    card.classList.add(
                        "selected"
                    );

                }

            });

    }


    /* ==========================================
       SHOW CURRENT STEP
    ========================================== */

    function showStep(step) {

        document
            .querySelectorAll(
                ".form-step"
            )
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
            .querySelectorAll(
                ".progress-step"
            )
            .forEach(item => {

                const stepNumber =
                    Number(
                        item.dataset.step
                    );


                if (
                    stepNumber <= step
                ) {

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

                (
                    (step - 1) /
                    (totalSteps - 1)
                )

                * 100;


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


    /* ==========================================
       UPDATE LIVE PREVIEW
    ========================================== */

    function updateLivePreview() {

        const occasion =
            occasionInput?.value || "";

        const relationship =
            relationshipInput?.value || "";

        const theme =
            themeInput?.value || "";

        const personName =
            personNameInput?.value.trim() ||
            "Someone Special";

        const message =
            messageInput?.value.trim() ||
            "Your special message will appear here.";

        const selectedPackage =
            packageInput?.value || "";


        /* OCCASION */

        if (previewOccasion) {

            previewOccasion.textContent =

                occasion

                    ? formatText(
                        occasion
                    )

                    : "Your Special Day";

        }


        /* EMOJI */

        if (previewEmoji) {

            previewEmoji.textContent =
                getOccasionEmoji(
                    occasion
                );

        }


        /* PERSON NAME */

        if (previewPersonName) {

            previewPersonName.textContent =
                personName;

        }


        /* RELATIONSHIP */

        if (previewRelationship) {

            previewRelationship.textContent =

                relationship

                    ? `Celebrating your ${formatText(
                        relationship
                    )} ❤️`

                    : "A celebration made with love ❤️";

        }


        /* MESSAGE */

        if (previewMessage) {

            previewMessage.textContent =
                message;

        }


        /* PACKAGE */

        if (previewPackage) {

            previewPackage.textContent =

                selectedPackage

                    ? formatText(
                        selectedPackage
                    )

                    : "Not selected";

        }


        /* THEME */

        if (
            livePreview &&
            theme
        ) {

            livePreview.className =
                `celebration-live-preview ${theme}`;

        }


        saveCustomization();

    }


    /* ==========================================
       CARD SELECTION
    ========================================== */

    function setupSelection(
        selector,
        hiddenInput
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


                    if (hiddenInput) {

                        hiddenInput.value =
                            card.dataset.value;

                    }


                    updateLivePreview();

                }
            );

        });

    }


    /* ==========================================
       SETUP SELECTIONS
    ========================================== */

    setupSelection(

        ".occasion-selection .selection-card",

        occasionInput

    );


    setupSelection(

        ".relationship-selection .selection-card",

        relationshipInput

    );


    setupSelection(

        ".theme-card",

        themeInput

    );


    setupSelection(

        ".package-option",

        packageInput

    );


    /* ==========================================
       TEXT INPUT EVENTS
    ========================================== */

    if (personNameInput) {

        personNameInput.addEventListener(

            "input",

            updateLivePreview

        );

    }


    if (customerNameInput) {

        customerNameInput.addEventListener(

            "input",

            saveCustomization

        );

    }


    if (specialDateInput) {

        specialDateInput.addEventListener(

            "change",

            () => {

                saveCustomization();

                updateLivePreview();

            }

        );

    }


    if (emailInput) {

        emailInput.addEventListener(

            "input",

            saveCustomization

        );

    }


    if (messageInput) {

        messageInput.addEventListener(

            "input",

            updateLivePreview

        );

    }


    /* ==========================================
       PHOTO PREVIEW
    ========================================== */

    if (
        photoInput &&
        photoPreview
    ) {

        photoInput.addEventListener(

            "change",

            () => {

                photoPreview.innerHTML = "";


                if (previewPhotos) {

                    previewPhotos.innerHTML = "";

                }


                const files =
                    Array.from(
                        photoInput.files
                    );


                if (
                    files.length === 0 &&
                    previewPhotos
                ) {

                    previewPhotos.innerHTML =

                        `
                        <div class="preview-photo-placeholder">

                            <i class="fa-solid fa-images"></i>

                        </div>
                        `;

                }


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

                            /* FORM PHOTO PREVIEW */

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


                            /* LIVE PREVIEW PHOTO */

                            if (previewPhotos) {

                                const previewImage =
                                    document.createElement(
                                        "img"
                                    );


                                previewImage.src =
                                    event.target.result;


                                previewImage.className =
                                    "live-preview-image";


                                previewPhotos.appendChild(
                                    previewImage
                                );

                            }

                        };


                    reader.readAsDataURL(
                        file
                    );

                });

            }

        );

    }


    /* ==========================================
       VALIDATE STEP
    ========================================== */

    function validateStep() {

        if (
            currentStep === 1 &&
            !occasionInput?.value
        ) {

            alert(
                "Please select an occasion 🎉"
            );

            return false;

        }


        if (
            currentStep === 2 &&
            !relationshipInput?.value
        ) {

            alert(
                "Please select who the celebration is for ❤️"
            );

            return false;

        }


        if (
            currentStep === 3 &&
            !themeInput?.value
        ) {

            alert(
                "Please select a website theme 🎨"
            );

            return false;

        }


        if (
            currentStep === 4
        ) {

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


            if (
                emailInput &&
                !emailInput.validity.valid
            ) {

                alert(
                    "Please enter a valid email address."
                );


                emailInput.focus();


                return false;

            }

        }


        if (
            currentStep === 5 &&
            !packageInput?.value
        ) {

            alert(
                "Please select a package 💎"
            );

            return false;

        }


        return true;

    }


    /* ==========================================
       NEXT BUTTON
    ========================================== */

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


                    updateLivePreview();

                }

            }

        );

    }


    /* ==========================================
       PREVIOUS BUTTON
    ========================================== */

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


    /* ==========================================
       SUBMIT ORDER
    ========================================== */

    if (form) {

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
                        occasionInput?.value || "",

                    relationship:
                        relationshipInput?.value || "",

                    theme:
                        themeInput?.value || "",

                    personName:
                        personNameInput?.value || "",

                    customerName:
                        customerNameInput?.value || "",

                    specialDate:
                        specialDateInput?.value || "",

                    email:
                        emailInput?.value || "",

                    message:
                        messageInput?.value || "",

                    package:
                        packageInput?.value || ""

                };


                localStorage.setItem(

                    "celebrateVerseOrder",

                    JSON.stringify(
                        celebrationData
                    )

                );


                const finalPackage =

                    String(
                        celebrationData.package
                    )

                    .trim()

                    .toLowerCase();


                window.location.href =

                    "payment.html?package=" +

                    encodeURIComponent(
                        finalPackage
                    );

            }

        );

    }


    /* ==========================================
       CLEAR CUSTOMIZATION
    ========================================== */

    window.clearCustomizationData =
        function () {

            localStorage.removeItem(
                AUTO_SAVE_KEY
            );


            if (form) {

                form.reset();

            }


            document
                .querySelectorAll(
                    ".selected"
                )
                .forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });


            if (photoPreview) {

                photoPreview.innerHTML = "";

            }


            if (previewPhotos) {

                previewPhotos.innerHTML =
                    `
                    <div class="preview-photo-placeholder">

                        <i class="fa-solid fa-images"></i>

                    </div>
                    `;

            }


            updateLivePreview();

        };


    /* ==========================================
       START
    ========================================== */

    restoreCustomization();

    showStep(
        currentStep
    );

    updateLivePreview();

});
