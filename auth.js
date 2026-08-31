document.addEventListener("DOMContentLoaded", () => {

    const signupForm =
        document.getElementById("signupForm");

    const loginForm =
        document.getElementById("loginForm");

    const authMessage =
        document.getElementById("authMessage");


    function showMessage(message, success = false) {

        if (!authMessage) return;

        authMessage.textContent =
            message;

        authMessage.className =
            success
                ? "auth-message success"
                : "auth-message error";

    }


    /* ==========================
       SIGNUP
    ========================== */

    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const name =
                    document
                        .getElementById("signupName")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("signupEmail")
                        .value
                        .trim()
                        .toLowerCase();


                const password =
                    document
                        .getElementById("signupPassword")
                        .value;


                if (
                    !name ||
                    !email ||
                    !password
                ) {

                    showMessage(
                        "Please fill all fields."
                    );

                    return;

                }


                const users =
                    JSON.parse(
                        localStorage.getItem(
                            "celebrateVerseUsers"
                        ) || "[]"
                    );


                const existingUser =
                    users.find(
                        user =>
                            user.email === email
                    );


                if (existingUser) {

                    showMessage(
                        "An account with this email already exists."
                    );

                    return;

                }


                const newUser = {

                    id:
                        Date.now(),

                    name,

                    email,

                    password,

                    createdAt:
                        new Date()
                            .toISOString()

                };


                users.push(
                    newUser
                );


                localStorage.setItem(
                    "celebrateVerseUsers",
                    JSON.stringify(users)
                );


                localStorage.setItem(
                    "celebrateVerseCurrentUser",
                    JSON.stringify({
                        id:
                            newUser.id,

                        name:
                            newUser.name,

                        email:
                            newUser.email
                    })
                );


                showMessage(
                    "Account created successfully! Redirecting...",
                    true
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    900
                );

            }
        );

    }


    /* ==========================
       LOGIN
    ========================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const email =
                    document
                        .getElementById("loginEmail")
                        .value
                        .trim()
                        .toLowerCase();


                const password =
                    document
                        .getElementById("loginPassword")
                        .value;


                const users =
                    JSON.parse(
                        localStorage.getItem(
                            "celebrateVerseUsers"
                        ) || "[]"
                    );


                const user =
                    users.find(
                        item =>
                            item.email === email &&
                            item.password === password
                    );


                if (!user) {

                    showMessage(
                        "Incorrect email or password."
                    );

                    return;

                }


                localStorage.setItem(
                    "celebrateVerseCurrentUser",
                    JSON.stringify({

                        id:
                            user.id,

                        name:
                            user.name,

                        email:
                            user.email

                    })
                );


                showMessage(
                    "Login successful! Redirecting...",
                    true
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    700
                );

            }
        );

    }

});
