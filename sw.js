const CACHE_NAME = "celebrateverse-v2";


const ASSETS = [

    "./",

    "./index.html",

    "./customize.html",

    "./payment.html",

    "./style.css",

    "./main.js",

    "./customize.js",

    "./payment.js",

    "./supabase.js",

    "./manifest.json",

    "./icon-192.png",

    "./icon-512.png"

];


/* =========================
   INSTALL SERVICE WORKER
========================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )

            .then(
                cache => {

                    return cache.addAll(
                        ASSETS
                    );

                }
            )

        );


        self.skipWaiting();

    }
);


/* =========================
   ACTIVATE SERVICE WORKER
========================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()

            .then(
                keys => {

                    return Promise.all(

                        keys.map(
                            key => {

                                if (
                                    key !==
                                    CACHE_NAME
                                ) {

                                    return caches.delete(
                                        key
                                    );

                                }

                            }
                        )

                    );

                }
            )

        );


        self.clients.claim();

    }
);


/* =========================
   FETCH FILES
========================= */

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            fetch(
                event.request
            )

            .then(
                response => {

                    return response;

                }
            )

            .catch(
                () => {

                    return caches.match(
                        event.request
                    );

                }
            )

        );

    }
);
