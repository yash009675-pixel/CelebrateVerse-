document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       CELEBRATEVERSE CUSTOMIZER SYSTEM
    ========================================== */

    let currentStep = Math.min(5, Math.max(1, Number(localStorage.getItem("celebrateVerseCurrentStep") || 1)));

    const totalSteps = 5;
    const PACKAGE_PRICES = { free: 0, basic: 199, premium: 399, ultimate: 699 };
    // Single canonical package price source for Customize, checkout and dashboard.
    window.CELEBRATEVERSE_PACKAGE_PRICES = Object.freeze({...PACKAGE_PRICES});


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

    const AUTO_SAVE_KEY = "celebrateVerseCustomization";
    const CURRENT_STEP_KEY = "celebrateVerseCurrentStep";
    /* Phase 1: normalize homepage query params into the wizard on first load. */
    function applyUrlPresets() {
        const params = new URLSearchParams(window.location.search);
        const occasion = params.get("occasion");
        const pkg = params.get("package");
        if (occasion && occasionInput && document.querySelector(`.occasion-selection .selection-card[data-value="${CSS.escape(occasion)}"]`)) {
            occasionInput.value = occasion;
        }
        if (pkg && packageInput && document.querySelector(`.package-option[data-value="${CSS.escape(pkg)}"]`)) {
            packageInput.value = pkg;
        }
        if (occasion) restoreSelectedCard(".occasion-selection .selection-card", occasion);
        if (pkg) restoreSelectedCard(".package-option", pkg);
    }
    const MAX_PHOTOS = 10;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    let currentDraftId = new URLSearchParams(window.location.search).get("draft");


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
       LIVE PREVIEW UPDATE
    ========================================== */
    function updateLivePreview() {
        const occasion = occasionInput?.value || "";
        const relationship = relationshipInput?.value || "";
        const personName = personNameInput?.value?.trim() || "Your special person";
        const message = messageInput?.value?.trim() || "A beautiful celebration made just for you.";
        const pkg = packageInput?.value || "";

        if (previewOccasion) previewOccasion.textContent = formatText(occasion) || "Your Celebration";
        if (previewEmoji) previewEmoji.textContent = getOccasionEmoji(occasion);
        if (previewPersonName) previewPersonName.textContent = personName;
        if (previewRelationship) previewRelationship.textContent = relationship ? formatText(relationship) : "";
        if (previewMessage) previewMessage.textContent = message;
        if (previewPackage) previewPackage.textContent = pkg ? formatText(pkg) : "";

        if (livePreview) {
            livePreview.classList.toggle("has-content", Boolean(occasion || personNameInput?.value || messageInput?.value));
        }

        if (previewPhotos && photoInput) {
            previewPhotos.innerHTML = "";
            const files = Array.from(photoInput.files || []).slice(0, MAX_PHOTOS);
            if (!files.length) {
                previewPhotos.innerHTML = '<div class="preview-photo-placeholder"><i class="fa-solid fa-images"></i></div>';
            } else {
                files.forEach(file => {
                    if (!file.type.startsWith("image/")) return;
                    const img = document.createElement("img");
                    img.alt = "Uploaded celebration photo";
                    img.loading = "lazy";
                    img.src = URL.createObjectURL(file);
                    img.onload = () => URL.revokeObjectURL(img.src);
                    previewPhotos.appendChild(img);
                });
            }
        }
    }

    if (photoInput) {
        photoInput.addEventListener("change", () => {
            saveCustomization();
            updateLivePreview();
        });
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
       CARD SELECTION
    ========================================== */
    function bindCardSelection(selector, input) {
        document.querySelectorAll(selector).forEach(card => {
            card.addEventListener("click", () => {
                document.querySelectorAll(selector).forEach(x => x.classList.remove("selected"));
                card.classList.add("selected");
                if (input) input.value = card.dataset.value || "";
                saveCustomization();
                updateLivePreview();
            });
            card.setAttribute("role","button");
            card.setAttribute("tabindex","0");
            card.addEventListener("keydown", e => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.click(); }
            });
        });
    }

    /* ==========================================
       STEP VALIDATION
    ========================================== */
    function getVisibleStep() {
        const active = document.querySelector(".form-step.active");
        return active ? Number(active.dataset.step) : currentStep;
    }

    function validateStep(step = getVisibleStep()) {
        step = Number(step) || 1;

        if (step === 1 && !occasionInput?.value) {
            alert("Please select an occasion to continue.");
            return false;
        }
        if (step === 2 && !relationshipInput?.value) {
            alert("Please select who this celebration is for.");
            return false;
        }
        if (step === 3 && !themeInput?.value) {
            alert("Please choose a website style.");
            return false;
        }
        if (step === 4) {
            const missing = [
                !personNameInput?.value?.trim(),
                !customerNameInput?.value?.trim(),
                !specialDateInput?.value,
                !emailInput?.value?.trim()
            ].some(Boolean);

            if (missing) {
                alert("Please complete all required details before continuing.");
                return false;
            }
            if (emailInput && !emailInput.checkValidity()) {
                alert("Please enter a valid email address.");
                emailInput.focus();
                return false;
            }
        }
        // Package selection is optional at the guided-preview stage.
        // Users must be able to finish the 1–5 creation flow and see their
        // live celebration in Edit Studio before making any purchase decision.
        if (step === 5 && !packageInput?.value) {
            return true;
        }
        return true;
    }

    bindCardSelection(".occasion-selection .selection-card", occasionInput);
    bindCardSelection(".relationship-selection .selection-card", relationshipInput);
    bindCardSelection(".theme-card", themeInput);
    bindCardSelection(".package-option", packageInput);

    // Keep all required wizard fields in the same draft, including Step 4 tone/photos.
    function saveExtendedCustomization() {
        try {
            const existing = JSON.parse(localStorage.getItem(AUTO_SAVE_KEY) || "{}");
            existing.wishTone = document.getElementById("wishTone")?.value || "";
            localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(existing));
        } catch (e) {}
    }
    ["wishTone","personName","customerName","specialDate","email","message"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", () => { saveCustomization(); saveExtendedCustomization(); updateLivePreview(); });
        if (el) el.addEventListener("change", () => { saveCustomization(); saveExtendedCustomization(); updateLivePreview(); });
    });

    /* ==========================================
       SHOW CURRENT STEP
    ========================================== */

    document.querySelectorAll(".progress-step").forEach(item => {
        item.addEventListener("click", () => {
            const target = Number(item.dataset.step);
            if (!target || target === currentStep) return;
            if (target > currentStep && !validateStep(currentStep)) return;
            currentStep = target;
            localStorage.setItem(CURRENT_STEP_KEY, String(currentStep));
            showStep(currentStep);
            updateLivePreview();
        });
    });

    function showStep(step) {

        currentStep = Math.min(5, Math.max(1, Number(step) || 1));
        localStorage.setItem(CURRENT_STEP_KEY, String(currentStep));
        document.querySelectorAll(".form-step").forEach(item => {
            const isActive = Number(item.dataset.step) === Number(step);
            item.classList.toggle("active", isActive);
            // Explicit visibility prevents legacy CSS from keeping a hidden/blank step on screen.
            item.style.display = isActive ? "block" : "none";
            item.style.visibility = isActive ? "visible" : "hidden";
            item.style.opacity = isActive ? "1" : "0";
            item.style.pointerEvents = isActive ? "auto" : "none";
        });

        const activeStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (activeStep) activeStep.scrollIntoView({behavior:"smooth", block:"start"});


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
            const progress = ((step - 1) / (totalSteps - 1)) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // End of showStep(). Navigation handlers must be outside this function.
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


                if (currentStep === totalSteps) {
                    // Phase 1: finish setup and open the real Edit Studio.
                    // Saving is handled by the existing submit handler; prevent
                    // the legacy payment/free-flow action from running here.
                    form?.dispatchEvent(new Event("submit", {bubbles:true, cancelable:true}));
                    return;
                }


                currentStep++;
                localStorage.setItem(CURRENT_STEP_KEY, String(currentStep));

                showStep(
                    currentStep
                );


                updateLivePreview();

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

                if (currentStep === 1) {

                    window.location.href = "index.html";

                    return;

                }


                currentStep--;
                localStorage.setItem(CURRENT_STEP_KEY, String(currentStep));

                showStep(
                    currentStep
                );

                updateLivePreview();

            }

        );

    }



    /* ==========================================
       SAVE DRAFT + CREATE CHECKOUT SESSION
    ========================================== */

    async function requireUser() {
        if (!supabaseClient) return null;
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user || null;
    }

    async function uploadPhotos(userId, celebrationId) {
        const files = Array.from(photoInput?.files || []);
        if (!files.length) return [];

        if (files.length > MAX_PHOTOS) throw new Error(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
        for (const file of files) {
            if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed.");
            if (file.size > MAX_FILE_SIZE) throw new Error("Each photo must be 5 MB or smaller.");
        }

        const uploaded = [];
        for (const file of files) {
            const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
            const path = `${userId}/${celebrationId}/${crypto.randomUUID()}.${ext}`;
            const { error } = await supabaseClient.storage.from("celebration-photos").upload(path, file, {
                cacheControl: "3600", upsert: false, contentType: file.type
            });
            if (error) throw error;
            uploaded.push(path);
        }
        return uploaded;
    }

    async function saveDraftToCloud(status = "draft") {
        const user = await requireUser();
        if (!user) throw new Error("Please log in before saving your celebration.");

        const celebrationData = {
            user_id: user.id,
            occasion: occasionInput?.value || "",
            relationship: relationshipInput?.value || "",
            theme: themeInput?.value || "",
            person_name: personNameInput?.value?.trim() || "",
            customer_name: customerNameInput?.value?.trim() || "",
            special_date: specialDateInput?.value || null,
            customer_email: emailInput?.value?.trim().toLowerCase() || "",
            message: messageInput?.value?.trim() || "",
            package: packageInput?.value || "",
            status
        };

        let celebration;
        if (currentDraftId) {
            const { data, error } = await supabaseClient.from("celebrations")
                .update(celebrationData).eq("id", currentDraftId).eq("user_id", user.id).select().single();
            if (error) throw error;
            celebration = data;
        } else {
            const { data, error } = await supabaseClient.from("celebrations")
                .insert(celebrationData).select().single();
            if (error) throw error;
            celebration = data;
            currentDraftId = celebration.id;
        }

        const photoPaths = await uploadPhotos(user.id, celebration.id);
        if (photoPaths.length) {
            const { error } = await supabaseClient.from("celebration_photos").insert(
                photoPaths.map(path => ({ celebration_id: celebration.id, user_id: user.id, storage_path: path }))
            );
            if (error) throw error;
        }
        return celebration;
    }

    if (form) {
        form.addEventListener("submit", async event => {
            event.preventDefault();
            if (!validateStep(currentStep)) return;

            const button = submitBtn || form.querySelector('button[type="submit"]');
            const original = button?.innerHTML;
            if (button) { button.disabled = true; button.textContent = "Saving celebration..."; }

            try {
                const celebration = await saveDraftToCloud("draft");
                const selectedPackage = packageInput?.value || "";
                const selectedPrice = PACKAGE_PRICES[selectedPackage] ?? 0;
                localStorage.setItem("celebrateVerseOrder", JSON.stringify({
                    celebrationId: celebration.id,
                    occasion: celebration.occasion,
                    relationship: celebration.relationship,
                    theme: celebration.theme,
                    personName: celebration.person_name,
                    customerName: celebration.customer_name,
                    specialDate: celebration.special_date,
                    email: celebration.customer_email,
                    message: celebration.message,
                    package: celebration.package,
                    price: selectedPrice
                }));
                // Payment is intentionally deferred. Every completed 1–5 wizard
                // flow goes straight to the live Edit Studio so the user can see,
                // enjoy, and freely customize the result before deciding to buy.
                localStorage.removeItem(AUTO_SAVE_KEY);
                localStorage.setItem("celebrateVerseLastCelebrationId", celebration.id);
                window.location.href = "edit-studio.html?celebration=" + encodeURIComponent(celebration.id) + "&from=wizard";
            } catch (error) {
                console.error(error);
                alert(error.message || "Unable to save your celebration. Please try again.");
            } finally {
                if (button) { button.disabled = false; button.innerHTML = original; }
            }
        });
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



    async function loadCloudDraft() {
        if (!currentDraftId || !supabaseClient) return;
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;
        const { data, error } = await supabaseClient.from("celebrations").select("*")
            .eq("id", currentDraftId).eq("user_id", user.id).maybeSingle();
        if (error || !data) return;
        if (occasionInput) occasionInput.value = data.occasion || "";
        if (relationshipInput) relationshipInput.value = data.relationship || "";
        if (themeInput) themeInput.value = data.theme || "";
        if (packageInput) packageInput.value = data.package || "";
        if (personNameInput) personNameInput.value = data.person_name || "";
        if (customerNameInput) customerNameInput.value = data.customer_name || "";
        if (specialDateInput) specialDateInput.value = data.special_date || "";
        if (emailInput) emailInput.value = data.customer_email || "";
        if (messageInput) messageInput.value = data.message || "";
        document.querySelectorAll(".selected").forEach(x => x.classList.remove("selected"));
        restoreSelectedCard(".occasion-selection .selection-card", data.occasion);
        restoreSelectedCard(".relationship-selection .selection-card", data.relationship);
        restoreSelectedCard(".theme-card", data.theme);
        restoreSelectedCard(".package-option", data.package);
        updateLivePreview();
    }

    /* ==========================================
       AI CREATION CO-PILOT
    ========================================== */
    const aiBuildBtn=document.getElementById("cvAiBuildBtn");
    const aiBuildInput=document.getElementById("cvAiBuildInput");
    const aiBuildStatus=document.getElementById("cvAiBuildStatus");
    if(aiBuildBtn){
      aiBuildBtn.addEventListener("click",async()=>{
        const request=(aiBuildInput?.value||"").trim();
        if(!request){ aiBuildStatus.textContent="Tell AI what you want to create first."; aiBuildInput?.focus(); return; }
        if(!window.cvBuildCelebration){ aiBuildStatus.textContent="AI is loading. Please try again."; return; }
        aiBuildBtn.disabled=true; aiBuildStatus.textContent="✨ AI is preparing your celebration…";
        try{
          const result=await window.cvBuildCelebration(request);
          const p=result?.plan||{};
          const set=(el,v)=>{if(el&&v)el.value=v};
          set(occasionInput,p.occasion);set(relationshipInput,p.relationship);set(themeInput,p.theme);
          set(personNameInput,p.personName);set(customerNameInput,p.customerName);set(specialDateInput,p.specialDate);
          set(emailInput,p.email);set(messageInput,p.message);
          set(document.getElementById("wishTone"),p.wishTone);
          restoreSelectedCard(".occasion-selection .selection-card",p.occasion);
          restoreSelectedCard(".relationship-selection .selection-card",p.relationship);
          restoreSelectedCard(".theme-card",p.theme);
          saveCustomization();saveExtendedCustomization();updateLivePreview();
          currentStep=4;localStorage.setItem(CURRENT_STEP_KEY,"4");showStep(4);updateLivePreview();
          aiBuildStatus.textContent="✅ AI filled your setup. Review it, add photos, then continue to Live Edit Studio.";
        }catch(e){aiBuildStatus.textContent="AI couldn't build this yet. "+(e.message||"Please try again.");}
        finally{aiBuildBtn.disabled=false;}
      });
    }

    /* ==========================================
       START
    ========================================== */

    restoreCustomization();
    applyUrlPresets();
    updateLivePreview();
    loadCloudDraft();

    showStep(
        currentStep
    );

    updateLivePreview();

    /* ==========================================
       FINAL WIZARD CONTROLLER
       Rebind the visible controls once so old
       duplicated handlers cannot block navigation.
    ========================================== */
    (() => {
        const next = document.getElementById("nextBtn");
        const prev = document.getElementById("prevBtn");
        if (!next || !prev) return;

        const cleanButton = (button) => {
            const clone = button.cloneNode(true);
            button.replaceWith(clone);
            return clone;
        };

        const nextControl = cleanButton(next);
        const prevControl = cleanButton(prev);

        nextControl.addEventListener("click", async (event) => {
            event.preventDefault();

            if (currentStep < totalSteps) {
                if (!validateStep(currentStep)) return;
                currentStep += 1;
                localStorage.setItem(CURRENT_STEP_KEY, String(currentStep));
                showStep(currentStep);
                updateLivePreview();
                return;
            }

            if (!validateStep(currentStep)) return;
            if (submitBtn) submitBtn.click();
        });

        prevControl.addEventListener("click", (event) => {
            event.preventDefault();
            if (currentStep <= 1) {
                window.location.href = "index.html";
                return;
            }
            currentStep -= 1;
            localStorage.setItem(CURRENT_STEP_KEY, String(currentStep));
            showStep(currentStep);
            updateLivePreview();
        });

        const refreshNavigation = () => {
            const isFirst = currentStep <= 1;
            const isLast = currentStep >= totalSteps;
            prevControl.textContent = isFirst ? "Back to Home" : "Back";
            nextControl.textContent = isLast ? "✨ Open Live Edit Studio" : "Continue";
            nextControl.disabled = false;
            prevControl.disabled = false;
        };

        const originalShowStep = showStep;
        // Keep navigation labels synchronized whenever the step changes.
        const observer = new MutationObserver(refreshNavigation);
        observer.observe(document.querySelector("form") || document.body, {subtree:true, childList:true, attributes:true, attributeFilter:["class"]});
        refreshNavigation();
    })();

});

/* Phase 2 — local personalized wish generator (no external AI API) */
document.addEventListener("DOMContentLoaded",()=>{const btn=document.getElementById("generateWishBtn"),tone=document.getElementById("wishTone"),msg=document.getElementById("message"),name=document.getElementById("personName"),occasion=document.getElementById("occasion"),rel=document.getElementById("relationship");if(!btn||!msg)return;const templates={friendly:(n,o)=>"Wishing you a wonderful "+o+"! May your day be filled with smiles, happiness and beautiful memories, "+n+"! 🎉",romantic:(n,o)=>"Happy "+o+", my love "+n+"! ❤️ Every moment with you is special, and I hope this celebration becomes another beautiful memory for us.",emotional:(n,o)=>"On this special "+o+", "+n+", I hope you always remember how deeply you are loved and appreciated. 🥹❤️",funny:(n,o)=>"Happy "+o+"! 😂 "+n+", may your celebration be bigger than your responsibilities and your cake bigger than your worries!",professional:(n,o)=>"Warm wishes to "+n+" on this special "+o+". Wishing you continued success, happiness and memorable moments.",respectful:(n,o)=>"Heartfelt wishes to "+n+" on this special "+o+". May the occasion bring peace, happiness and many blessings. 🙏",exciting:(n,o)=>"It's celebration time! 🥳 Happy "+o+", "+n+"! Here's to amazing moments, great memories and an unforgettable day!",inspirational:(n,o)=>"Happy "+o+", "+n+"! ✨ May this new chapter bring you courage, growth, meaningful moments and countless reasons to celebrate.",family:(n,o)=>"Happy "+o+", dear "+n+"! ❤️ Wishing you love, laughter, togetherness and many wonderful memories with the family."};btn.addEventListener("click",()=>{const n=(name?.value||"there").trim(),o=(occasion?.value||"special occasion").replace(/[-_]/g," ").trim(),t=tone?.value||"friendly";msg.value=templates[t](n,o);msg.dispatchEvent(new Event("input",{bubbles:true}));msg.focus()})});
