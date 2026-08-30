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
           PAYMENT BUTTON
        ========================= */

        const payButton =
            document.getElementById(
                "payButton"
            );


        payButton.addEventListener(
            "click",
            () => {


                /*
                 REAL PAYMENT GATEWAY
                 WILL BE CONNECTED
                 IN A FUTURE PART.
                */


                alert(
                    "Payment gateway will be connected soon! 💳"
                );


            }
        );


    }
);
