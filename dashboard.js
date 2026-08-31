document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       USER CHECK
    ========================== */

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "celebrateVerseCurrentUser"
            )
        );


    if (!currentUser) {

        window.location.href =
            "login.html";

        return;

    }


    const userName =
        document.getElementById(
            "userName"
        );


    if (userName) {

        userName.textContent =
            currentUser.name;

    }


    /* ==========================
       TABS
    ========================== */

    const navItems =
        document.querySelectorAll(
            ".dashboard-nav-item"
        );


    const tabs =
        document.querySelectorAll(
            ".dashboard-tab"
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const tabName =
                        item.dataset.tab;


                    navItems.forEach(
                        nav =>
                            nav.classList.remove(
                                "active"
                            )
                    );


                    tabs.forEach(
                        tab =>
                            tab.classList.remove(
                                "active"
                            )
                    );


                    item.classList.add(
                        "active"
                    );


                    document
                        .getElementById(
                            tabName
                        )
                        .classList.add(
                            "active"
                        );

                }
            );

        }
    );


    /* ==========================
       DATA
    ========================== */

    const drafts =
        JSON.parse(
            localStorage.getItem(
                "celebrateVerseDrafts"
            ) || "[]"
        );


    const orders =
        JSON.parse(
            localStorage.getItem(
                "celebrateVerseOrders"
            ) || "[]"
        );


    const totalDrafts =
        document.getElementById(
            "totalDrafts"
        );


    const totalOrders =
        document.getElementById(
            "totalOrders"
        );


    const totalCelebrations =
        document.getElementById(
            "totalCelebrations"
        );


    if (totalDrafts) {

        totalDrafts.textContent =
            drafts.length;

    }


    if (totalOrders) {

        totalOrders.textContent =
            orders.length;

    }


    if (totalCelebrations) {

        totalCelebrations.textContent =
            drafts.length +
            orders.length;

    }


    /* ==========================
       DRAFT LIST
    ========================== */

    const draftList =
        document.getElementById(
            "draftList"
        );


    if (draftList) {

        if (
            drafts.length === 0
        ) {

            draftList.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        ✨
                    </div>

                    <h3>
                        No drafts yet
                    </h3>

                    <p>
                        Start creating your
                        first celebration.
                    </p>

                    <a
                        href="customize.html"
                        class="primary-btn">

                        Create Celebration

                    </a>

                </div>

            `;

        } else {

            draftList.innerHTML =
                drafts
                    .map(
                        draft => `

                        <div class="dashboard-item">

                            <div class="dashboard-item-icon">
                                🎉
                            </div>

                            <div>

                                <h3>
                                    ${
                                        draft.title ||
                                        "Untitled Celebration"
                                    }
                                </h3>

                                <p>
                                    ${
                                        draft.occasion ||
                                        "Custom Celebration"
                                    }
                                </p>

                            </div>

                            <a
                                href="customize.html"
                                class="item-action">

                                Continue

                            </a>

                        </div>

                    `
                    )
                    .join("");

        }

    }


    /* ==========================
       ORDER LIST
    ========================== */

    const orderList =
        document.getElementById(
            "orderList"
        );


    if (orderList) {

        if (
            orders.length === 0
        ) {

            orderList.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📦
                    </div>

                    <h3>
                        No orders yet
                    </h3>

                    <p>
                        Your completed
                        celebration orders
                        will appear here.

                    </p>

                </div>

            `;

        } else {

            orderList.innerHTML =
                orders
                    .map(
                        order => `

                        <div class="dashboard-item">

                            <div class="dashboard-item-icon">
                                🎊
                            </div>

                            <div>

                                <h3>
                                    ${
                                        order.title ||
                                        "CelebrateVerse Order"
                                    }
                                </h3>

                                <p>
                                    ${
                                        order.status ||
                                        "Processing"
                                    }
                                </p>

                            </div>

                            <span class="order-status">

                                ${
                                    order.status ||
                                    "Processing"
                                }

                            </span>

                        </div>

                    `
                    )
                    .join("");

        }

    }


    /* ==========================
       LOGOUT
    ========================== */

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "celebrateVerseCurrentUser"
                );


                window.location.href =
                    "index.html";

            }
        );

    }

});
