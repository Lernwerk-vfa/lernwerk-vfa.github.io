/* Lernwerk 202611201401: erst Netz, sonst Zwischenspeicher. Anmeldung und Abgleich laufen nie über den Zwischenspeicher. */
const CACHE = "lernwerk-202611201401";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./manifest.json", "./icon-192.png"]))); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(l => Promise.all(l.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./"))));
});
