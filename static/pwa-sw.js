function asset(file) {
    return `/${(file ? file : "")}`
}
function remoteAsset(file) {
    // Para peticiones http se requiere el plugin advanced http request
    // local (intranet)
    return `http://localhost/practicas/jwt/${file ? file : ""}`
    // return `http://192.168.1.70/practicas/jwt/${file ? file : ""}`

    // tunnel
    // ngrok
    // return `https://870d-189-159-252-175.ngrok-free.app/practicas/jwt/${file ? file : ""}`
    // cloudflared tunnel --url http://localhost:80
    // return `https://surrey-freeze-matched-now.trycloudflare.com/practicas/jwt/${file ? file : ""}`

    // hosting
    // return `https://domingodesarrollando.com/test/jwt/${file ? file : ""}`
}

// Se eliminan las funciones de notificaciones push y sync.

const PRECACHENAME          = "flask2-precache-v1"
// Se eliminan SYNCEVENTNAME y PERIODICSYNCEVENTNAME.

const OFFLINEURL            = asset("offline")

const PRECACHEFILES         = [
    asset("static/favicon.ico"),
    asset("static/favicon.png"),
    asset("static/favicon-512x512.png"),
    asset("static/favicon-maskable.png"),
    asset("manifest.json"),
    asset(),
    asset("?source=pwa"),
    OFFLINEURL,

    // dashboard
    asset("dashboard"),
    asset("login"),
    asset("registros"),
    asset("registro"),
    // Se elimina asset("notificaciones"),
    asset("static/js/app.js"),

    // landing page
    asset("static/w3/w3.css"),
    asset("static/w3/app.jpg"),
    asset("static/w3/app2.jpg"),
    asset("static/w3/app4.jpg"),
    asset("static/w3/app5.jpg"),
    asset("static/w3/img_app.jpg"),
    "https://fonts.googleapis.com/css?family=Poppins",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",

    // global
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.4/font/bootstrap-icons.css",
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2?dd67030699838ea613ee6dbda90effa6",
    "https://code.jquery.com/jquery-3.7.1.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.5/jquery.validate.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.5/additional-methods.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/angular-route/1.8.3/angular-route.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/luxon/3.5.0/luxon.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/themes/dark.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/flatpickr.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.6.13/l10n/es.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.3.2/jsencrypt.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.33.1/plotly.min.js",
    "https://cdn.datatables.net/2.3.0/css/dataTables.bootstrap5.min.css",
    "https://cdn.datatables.net/2.3.0/js/dataTables.min.js",
    "https://cdn.datatables.net/2.3.0/js/dataTables.bootstrap5.min.js",
    "https://cdn.datatables.net/fixedheader/4.0.1/css/fixedHeader.bootstrap5.min.css",
    "https://cdn.datatables.net/fixedheader/4.0.1/js/dataTables.fixedHeader.min.js",
    "https://cdn.datatables.net/fixedheader/4.0.1/js/fixedHeader.bootstrap5.min.js",
]

self.addEventListener("message", function (event) {
    console.log("info")
    console.info("Mensaje recibido del cliente:", event.data)
})
self.addEventListener("install", function (event) {
    event.waitUntil(
        (async function () {
            const cache  = await caches.open(PRECACHENAME)
            const length = PRECACHEFILES.length

            for (let x in PRECACHEFILES) {
                const file = PRECACHEFILES[x]
                try {
                    await cache.add(file)
                }
                catch (error) {
                    console.log("error")
                    console.error(`Error al cachear: ${file}`, error)
                }

                self.clients.matchAll({
                    includeUncontrolled: true,
                    type: "window"
                }).then(function (clients) {
                    clients.forEach(function (client) {
                        client.postMessage({
                            subject: "installationProgress",
                            message: {
                                length: length,
                                x: x
                            }
                        })
                    })
                })
            }
        })()

        /**
        // Version estable sin retroalimentaci.n de progreso de cache
        caches.open(PRECACHENAME).then(function (cache) {
            console.log("info")
            console.info("Instalando...")

            return cache.addAll(PRECACHEFILES)
            .then(function () {
                console.log("info")
                console.info("Instalaci.n Completa")
            })
            .catch(function (err) {
                console.log("error")
                console.error("Boo!", err)
            })
        })
        */
    )
})
self.addEventListener("activate", function (event) {
    // the old version is gone now, do what you couldn't
    // do while it was still around
    // event.waitUntil()
})
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (cachedResponse) {
            return cachedResponse || fetch(event.request).catch(async function (err) {
                if (event.request.mode === "navigate") {
                    console.log("error")
                    console.error("Fetch failed; returning offline page instead.", err)

                    const cache = await caches.open(PRECACHENAME)
                    const cachedResponse = await cache.match(OFFLINEURL)

                    return cachedResponse
                }
            })
        })
        .catch(function (err) {
            console.log("error")
            console.error("Boo!", err)
        })
    )
})

// Se eliminan los event listeners 'sync', 'periodicsync', y 'push'.