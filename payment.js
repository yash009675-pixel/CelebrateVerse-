document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =========================
           GET SAVED ORDER
        ========================= */

        const savedOrder =
            localStorage.getItem(
                "celebrateVerseOrder"
            );


        if (!savedOrder) {

            alert(
                "No celebration details found. Please create your celebration first."
            );


            window.location.href =
                "customize.html";


            return;

        }


        const order =
            JSON.parse(savedOrder);



        /* =========================
           FORMAT TEXT
        ========================= */

        function formatText(text) {

            if (!text) return "-";


            return text
                .replace(
                    /-/g,
                    " "
                )
                .replace(
                    /\b\w/g,
                    char =>
                        char.toUpperCase()
                );

        }



        /* =========================
           PACKAGE PRICES
        ========================= */

        const packagePrices = {

            basic: 499,

            premium: 999,

            ultimate: 1999

        };


        const price =
            packagePrices[
                order.package
            ] || 0;



        /* =========================
           DATE FORMAT
        ========================= */

        let formattedDate = "-";


        if (order.specialDate) {

            const date =
                new Date(
                    order.specialDate +
                    "T00:00:00"
                );


            formattedDate =
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



        /* =========================
           UPDATE SUMMARY
        ========================= */

        document.getElementById(
            "summaryPersonName"
        ).textContent =
            order.personName ||
            "Your Special Moment";


        document.getElementById(
            "summaryOccasion"
        ).textContent =
            formatText(
                order.occasion
            );


        document.getElementById(
            "summaryRelationship"
        ).textContent =
            formatText(
                order.relationship
            );


        document.getElementById(
            "summaryTheme"
        ).textContent =
            formatText(
                order.theme
            );


        document.getElementById(
            "summaryDate"
        ).textContent =
            formattedDate;


        document.getElementById(
            "summaryPackage"
        ).textContent =
            formatText(
                order.package
            );


        document.getElementById(
            "summaryPrice"
        ).textContent =
            "₹" +
            price.toLocaleString(
                "en-IN"
            );


        document.getElementById(
            "summaryTotal"
        ).textContent =
            "₹" +
            price.toLocaleString(
                "en-IN"
            );


        /* =========================
           SPECIAL MESSAGE
        ========================= */

        const messageBox =
            document.getElementById(
                "summaryMessage"
            );


        if (
            order.message &&
            order.message.trim() !== ""
        ) {

            messageBox.textContent =
                "💌 " +
                order.message;

        } else {

            messageBox.textContent =
                "Your personalized celebration website will be created especially for this special moment. ✨";

        }



        /* =========================
           PAYMENT METHOD
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
   CREATE REAL ORDER
========================= */

const payButton = document.getElementById("payButton");

if (!payButton) {

    console.error("payButton not found");

} else {

    payButton.addEventListener(
        "click",
        async () => {

            /* =========================
               CHECK SUPABASE
            ========================= */

            if (
                typeof supabaseClient === "undefined" ||
                !supabaseClient
            ) {

                console.error(
                    "Supabase client is not initialized"
                );

                alert(
                    "Supabase connection error. Please check supabase.js."
                );

                return;

            }


            /* =========================
               PREVENT DOUBLE CLICK
            ========================= */

            payButton.disabled = true;

            const originalButtonHTML =
                payButton.innerHTML;


            payButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Creating Your Order...
            `;


            try {


                /* =========================
                   CHECK PACKAGE
                ========================= */

                if (
                    !order.package ||
                    !packagePrices[order.package]
                ) {

                    throw new Error(
                        "Please select a valid package."
                    );

                }


                /* =========================
                   CREATE ORDER DATA
                ========================= */

                const orderData = {

                    occasion:
                        order.occasion || "",

                    relationship:
                        order.relationship || "",

                    theme:
                        order.theme || "",

                    person_name:
                        order.personName || "",

                    customer_name:
                        order.customerName || "",

                    special_date:
                        order.specialDate || null,

                    email:
                        order.email || "",

                    message:
                        order.message || "",

                    package:
                        order.package,

                    amount:
                        Number(price),

                    payment_status:
                        "pending",

                    order_status:
                        "new"

                };


                console.log(
                    "Sending order:",
                    orderData
                );


                /* =========================
                   INSERT ORDER
                ========================= */

                const {
                    data,
                    error
                } = await supabaseClient
                    .from("orders")
                    .insert(orderData)
                    .select("id")
                    .single();


                /* =========================
                   CHECK SUPABASE ERROR
                ========================= */

                if (error) {

                    console.error(
                        "Supabase Error:",
                        error
                    );

                    throw new Error(
                        error.message ||
                        "Database error"
                    );

                }


                /* =========================
                   CHECK ORDER ID
                ========================= */

                if (
                    !data ||
                    !data.id
                ) {

                    throw new Error(
                        "Order was created but Order ID was not received."
                    );

                }


                /* =========================
                   SAVE ORDER ID
                ========================= */

                localStorage.setItem(
                    "celebrateVerseOrderId",
                    data.id
                );


                console.log(
                    "Order Created Successfully:",
                    data
                );


                /* =========================
                   SUCCESS BUTTON
                ========================= */

                payButton.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Order Created Successfully
                `;


                alert(
                    "🎉 Order created successfully!"
                );


                /*
                   NEXT STEP:
                   PAYMENT GATEWAY
                */

                setTimeout(
                    () => {

                        /*
                        Example:

                        window.location.href =
                            "payment-success.html";
                        */

                    },
                    500
                );


            } catch (error) {


                /* =========================
                   SHOW REAL ERROR
                ========================= */

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


                /* =========================
                   RESET BUTTON
                ========================= */

                payButton.disabled =
                    false;


                payButton.innerHTML =
                    originalButtonHTML;



        }
    );

}
    }
);
