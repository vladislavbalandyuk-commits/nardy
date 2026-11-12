// service worker: (1) notifications — shows pushes from the server and opens the game when one is tapped;
// (2) 0.49: a cache for speed — files whose name carries a version (?v=…), sounds, effects, fonts and the
// fixed-version libraries come from the cache at once; the page itself always asks the network first
// (falls back to the cached copy only when the network is down or slower than 4 s).
const CACHE = 'nardy-c1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('nardy-') && k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
const put = (req, res) => { if (res && (res.ok || res.type === 'opaque')) { const c = res.clone(); caches.open(CACHE).then((x) => x.put(req, c)).catch(() => {}); } return res; };
async function cacheFirst(req) { const hit = await caches.match(req); if (hit) return hit; return put(req, await fetch(req)); }
async function staleWhileRevalidate(req) { const hit = await caches.match(req); const net = fetch(req).then((r) => put(req, r)).catch(() => hit); return hit || net; }
async function networkFirst(req) {
  const net = fetch(req).then((r) => put(req, r));
  try { return await Promise.race([net, new Promise((_, no) => setTimeout(() => no(new Error('slow')), 4000))]); }
  catch (e) { const hit = await caches.match(req); if (hit) return hit; return net; }
}
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) {
    if (u.hostname === 'fonts.gstatic.com' || (u.hostname === 'cdn.jsdelivr.net' && /@\d/.test(u.pathname))) e.respondWith(cacheFirst(r));
    else if (u.hostname === 'fonts.googleapis.com') e.respondWith(staleWhileRevalidate(r));
    return;
  }
  if (r.mode === 'navigate') { e.respondWith(networkFirst(r)); return; }
  if (/\/snd\/radio\//.test(u.pathname)) return;   // 0.54: radio tracks stream straight from the network (range requests)
  if (/[?&]v=/.test(u.search) || /\/(sfx|fx|snd|emoji)\//.test(u.pathname)) { e.respondWith(cacheFirst(r)); return; }
  if (/\.(png|svg|webmanifest)$/.test(u.pathname)) { e.respondWith(staleWhileRevalidate(r)); return; }
});
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Нарди', { body: d.body || '', tag: d.tag || 'nardy', renotify: true, icon: '/icon-192.png', badge: '/icon-192.png', data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((L) => {
    for (const c of L) { if (c.url.startsWith(self.registration.scope)) { c.postMessage({ nav: url }); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
