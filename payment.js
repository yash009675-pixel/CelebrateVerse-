document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       PACKAGE PRICES
    ========================= */

    const packagePrices = {
        basic: 499,
        premium: 999,
        ultimate: 1999
    };


    /* =========================
       GET URL PACKAGE
    ========================= */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlPackage =
        params.get("package");


    /* =========================
       GET SAVED ORDER
    ========================= */

    let order = {};


    const savedOrder =
        localStorage.getItem(
            "celebrateVerseOrder"
        );


    if (savedOrder) {

        try {

            order =
                JSON.parse(savedOrder);

        } catch (error) {

            console.error(
                "LocalStorage Error:",
                error
            );

        }

    }


    console.log(
        "SAVED ORDER:",
        order
    );


    console.log(
        "URL PACKAGE:",
        urlPackage
    );


    /* =========================
       GET PACKAGE
       URL HAS FIRST PRIORITY
    ========================= */

    let selectedPackage =
        urlPackage ||
        order.package ||
        "";


    selectedPackage =
        String(selectedPackage)
            .trim()
            .toLowerCase();


    console.log(
        "FINAL PACKAGE:",
        selectedPackage
    );


    /* =========================
       GET PRICE
    ========================= */

    const price =
        packagePrices[selectedPackage] ||
        0;


    console.log(
        "FINAL PRICE:",
        price
    );


    /* =========================
       FORMAT TEXT
    ========================= */

    function formatText(text) {

        if (!text) {

            return "-";

        }


        return String(text)
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );

    }


    /* =========================
       FORMAT PRICE
    ========================= */

    function formatPrice(amount) {

        return (
            "₹" +
            Number(amount).toLocaleString(
                "en-IN"
            )
        );

    }


    /* =========================
       UPDATE ELEMENT
    ========================= */

    function updateElement(
        id,
        value
    ) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                value;

        }

    }


    /* =========================
       UPDATE SUMMARY
    ========================= */

    updateElement(
        "summaryPersonName",
        order.personName ||
        "Your Special Moment"
    );


    updateElement(
        "summaryOccasion",
        formatText(
            order.occasion
        )
    );


    updateElement(
        "summaryRelationship",
        formatText(
            order.relationship
        )
    );


    updateElement(
        "summaryTheme",
        formatText(
            order.theme
        )
    );


    /* =========================
       DATE
    ========================= */

    let formattedDate =
        "-";


    if (order.specialDate) {

        const date =
            new Date(
                order.specialDate +
                "T00:00:00"
            );


        if (
            !isNaN(
                date.getTime()
            )
        ) {

            formattedDate =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );

        }

    }


    updateElement(
        "summaryDate",
        formattedDate
    );


    /* =========================
       PACKAGE SUMMARY
    ========================= */

    updateElement(
        "summaryPackage",
        formatText(
            selectedPackage
        )
    );


    updateElement(
        "summaryPrice",
        formatPrice(
            price
        )
    );


    updateElement(
        "summaryTotal",
        formatPrice(
            price
        )
    );


    /* =========================
       SPECIAL MESSAGE
    ========================= */

    const messageBox =
        document.getElementById(
            "summaryMessage"
        );


    if (messageBox) {

        if (
            order.message &&
            order.message.trim()
        ) {

            messageBox.textContent =
                "💌 " +
                order.message;

        } else {

            messageBox.textContent =
                "Your personalized celebration website will be created especially for this special moment. ✨";

        }

    }


    /* =========================
       PAYMENT METHODS
    ========================= */

    const paymentMethods =
        document.querySelectorAll(
            ".payment-method"
        );


    paymentMethods.forEach(
        method => {

            method.addEventListener(
                "click",
                () => {

                    paymentMethods.forEach(
                        item => {

                            item.classList.remove(
                                "active-payment"
                            );

                        }
                    );


                    method.classList.add(
                        "active-payment"
                    );

                }
            );

        }
    );


    /* =========================
       PAY BUTTON
    ========================= */

    const payButton =
        document.getElementById(
            "payButton"
        );


    if (!payButton) {

        return;

    }


    payButton.addEventListener(
        "click",
        async () => {


            if (
                price === 0
            ) {

                alert(
                    "Package price is missing. Please go back and select your package again."
                );

                return;

            }


            alert(
                "Selected Package: " +
                formatText(selectedPackage) +
                "\nAmount: " +
                formatPrice(price)
            );


            /*
            SUPABASE ORDER CODE
            WILL BE ADDED HERE
            AFTER PRICE IS CONFIRMED
            */

        }
    );


});
