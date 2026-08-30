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
       GET SAVED ORDER
    ========================= */

    const savedOrder =
        localStorage.getItem("celebrateVerseOrder");


    if (!savedOrder) {

        console.error("No saved order found");

        alert(
            "No celebration details found. Please create your celebration first."
        );

        window.location.href =
            "customize.html";

        return;

    }


    let order;


    try {

        order =
            JSON.parse(savedOrder);

    } catch (error) {

        console.error(
            "Order JSON Error:",
            error
        );

        alert(
            "Saved order data is corrupted. Please create your celebration again."
        );

        localStorage.removeItem(
            "celebrateVerseOrder"
        );

        window.location.href =
            "customize.html";

        return;

    }


    console.log(
        "FULL SAVED ORDER:",
        order
    );


    /* =========================
       FIX PACKAGE VALUE
    ========================= */

    let selectedPackage =
        order.package;


    if (selectedPackage) {

        selectedPackage =
            String(selectedPackage)
                .trim()
                .toLowerCase();

    }


    console.log(
        "SELECTED PACKAGE:",
        selectedPackage
    );


    const price =
        packagePrices[selectedPackage] || 0;


    console.log(
        "PACKAGE PRICE:",
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
                character =>
                    character.toUpperCase()
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
       FORMAT DATE
    ========================= */

    function formatDate(dateValue) {

        if (!dateValue) {

            return "-";

        }


        try {

            const date =
                new Date(
                    dateValue +
                    "T00:00:00"
                );


            if (
                isNaN(
                    date.getTime()
                )
            ) {

                return dateValue;

            }


            return date.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

        } catch (error) {

            console.error(
                "Date Error:",
                error
            );

            return "-";

        }

    }


    /* =========================
       SAFE UPDATE FUNCTION
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

        } else {

            console.warn(
                "Element not found:",
                id
            );

        }

    }


    /* =========================
       UPDATE ORDER SUMMARY
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


    updateElement(
        "summaryDate",
        formatDate(
            order.specialDate
        )
    );


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
            String(
                order.message
            ).trim() !== ""
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
       PACKAGE ERROR CHECK
    ========================= */

    if (price === 0) {

        console.error(
            "INVALID PACKAGE:",
            selectedPackage
        );

        console.error(
            "Available packages:",
            Object.keys(
                packagePrices
            )
        );

    }


    /* =========================
       PAYMENT METHOD SELECT
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


                    console.log(
                        "Payment method:",
                        method.dataset.method
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

        console.error(
            "payButton not found"
        );

        return;

    }


    payButton.addEventListener(
        "click",
        async () => {


            /* =========================
               CHECK PACKAGE
            ========================= */

            if (
                !selectedPackage ||
                !packagePrices[selectedPackage]
            ) {

                alert(
                    "Package information is missing. Please select your package again."
                );


                window.location.href =
                    "customize.html";

                return;

            }


            /* =========================
               CHECK SUPABASE
            ========================= */

            if (
                typeof supabaseClient ===
                "undefined"
            ) {

                console.error(
                    "supabaseClient is undefined"
                );

                alert(
                    "Database connection error. Please check supabase.js."
                );

                return;

            }


            /* =========================
               GET PAYMENT METHOD
            ========================= */

            const activePayment =
                document.querySelector(
                    ".payment-method.active-payment"
                );


            const paymentMethod =
                activePayment
                    ? activePayment.dataset.method
                    : "upi";


            /* =========================
               PREVENT DOUBLE CLICK
            ========================= */

            payButton.disabled =
                true;


            const originalButtonHTML =
                payButton.innerHTML;


            payButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Creating Your Order...
            `;


            try {


                /* =========================
                   ORDER DATA
                ========================= */

                const orderData = {

                    occasion:
                        order.occasion || null,

                    relationship:
                        order.relationship || null,

                    theme:
                        order.theme || null,

                    person_name:
                        order.personName || null,

                    customer_name:
                        order.customerName || null,

                    special_date:
                        order.specialDate || null,

                    email:
                        order.email || null,

                    message:
                        order.message || null,

                    package:
                        selectedPackage,

                    amount:
                        Number(price),

                    payment_method:
                        paymentMethod,

                    payment_status:
                        "pending",

                    order_status:
                        "new"

                };


                console.log(
                    "SENDING ORDER:",
                    orderData
                );


                /* =========================
                   INSERT INTO SUPABASE
                ========================= */

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("orders")
                        .insert(
                            [orderData]
                        )
                        .select();


                /* =========================
                   DATABASE ERROR
                ========================= */

                if (error) {

                    console.error(
                        "SUPABASE ERROR:",
                        error
                    );

                    throw new Error(
                        error.message
                    );

                }


                console.log(
                    "ORDER CREATED:",
                    data
                );


                /* =========================
                   SAVE ORDER ID
                ========================= */

                if (
                    data &&
                    data.length > 0 &&
                    data[0].id
                ) {

                    localStorage.setItem(
                        "celebrateVerseOrderId",
                        data[0].id
                    );

                }


                /* =========================
                   SUCCESS
                ========================= */

                payButton.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Order Created Successfully
                `;


                alert(
                    "🎉 Order created successfully!"
                );


                /* =========================
                   FUTURE PAYMENT PAGE
                ========================= */

                setTimeout(
                    () => {

                        /*
                        window.location.href =
                            "payment-success.html";
                        */

                    },
                    500
                );


            } catch (error) {


                console.error(
                    "ORDER ERROR:",
                    error
                );


                alert(
                    "Order Error: " +
                    (
                        error.message ||
                        "An unexpected error occurred."
                    )
                );


                payButton.disabled =
                    false;


                payButton.innerHTML =
                    originalButtonHTML;

            }


        }
    );


});
