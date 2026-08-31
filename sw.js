/* ==========================================
   CELEBRATEVERSE SERVICE WORKER
   VERSION 6 - CLEAN UPDATE SYSTEM
========================================== */

const CACHE_NAME =
    "celebrateverse-v6";


/* ==========================================
   INSTALL
========================================== */

self.addEventListener(
    "install",
    event => {

        self.skipWaiting();

    }
);


/* ==========================================
   ACTIVATE
   DELETE ALL OLD CACHES
========================================== */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(keys => {

                    return Promise.all(

                        keys.map(
                            key =>
                                caches.delete(
                                    key
                                )
                        )

                    );

                })
                .then(() => {

                    return self.clients.claim();

                })

        );

    }
);


/* ==========================================
   FETCH
   ALWAYS USE LATEST WEBSITE FILES
========================================== */

self.addEventListener(
    "fetch",
    event => {

        /*
         Don't intercept requests.
         Browser will always load the latest
         version from GitHub Pages.
        */

        return;

    }
);


/* ==========================================
   FORCE UPDATE MESSAGE
========================================== */

self.addEventListener(
    "message",
    event => {

        if (
            event.data &&
            event.data.type ===
            "SKIP_WAITING"
        ) {

            self.skipWaiting();

        }

    }
);
