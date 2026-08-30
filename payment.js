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

const payButton =
    document.getElementById(
        "payButton"
    );


payButton.addEventListener(
    "click",
    async () => {


        payButton.disabled = true;


        payButton.innerHTML =
            `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Creating Your Order...
            `;


        try {


            const orderData = {

                occasion:
                    order.occasion,

                relationship:
                    order.relationship,

                theme:
                    order.theme,

                person_name:
                    order.personName,

                customer_name:
                    order.customerName,

                special_date:
                    order.specialDate,

                email:
                    order.email,

                message:
                    order.message || "",

                package:
                    order.package,

                amount:
                    price,

                payment_status:
                    "pending",

                order_status:
                    "new"

            };


            const {
                data,
                error
            } =
                await supabaseClient
                    .from("orders")
                    .insert([
                        orderData
                    ])
                    .select();


            if (error) {

                console.error(
                    error
                );


                alert(
                    "Something went wrong while creating your order. Please try again."
                );


                payButton.disabled =
                    false;


                payButton.innerHTML =
                    `
                    <i class="fa-solid fa-lock"></i>
                    <span>
                        Continue to Secure Payment
                    </span>
                    `;


                return;

            }


            console.log(
                "Order Created:",
                data
            );


            /*
             SAVE ORDER ID
             FOR PAYMENT
            */

            localStorage.setItem(
                "celebrateVerseOrderId",
                data[0].id
            );


            alert(
                "🎉 Order created successfully!"
            );


            /*
             PAYMENT GATEWAY
             NEXT PART
            */

            payButton.innerHTML =
                `
                <i class="fa-solid fa-check"></i>
                Order Created Successfully
                `;


        } catch (error) {


            console.error(
                error
            );


            alert(
                "An unexpected error occurred."
            );


            payButton.disabled =
                false;


            payButton.innerHTML =
                `
                <i class="fa-solid fa-lock"></i>
                <span>
                    Continue to Secure Payment
                </span>
                `;

        }


    }
);
            }
);
