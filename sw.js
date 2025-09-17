const CACHE = 'pyodide-exec-v1';
const PRECACHE = [
'./',
'./index.html',
'./manifest.webmanifest'
// 如有本地圖片、CSS，也可加進來，例如 './styles.css'
];


self.addEventListener('install', (e) => {
e.waitUntil(
caches.open(CACHE).then((c) => c.addAll(PRECACHE))
);
});


self.addEventListener('activate', (e) => {
e.waitUntil(
caches.keys().then((keys) => Promise.all(
keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
))
);
});


self.addEventListener('fetch', (e) => {
e.respondWith(
caches.match(e.request).then((cached) => {
return (
cached ||
fetch(e.request).then((res) => {
// 動態把回應放入快取（含 CDN 的 pyodide 檔案）
const copy = res.clone();
caches.open(CACHE).then((c) => c.put(e.request, copy));
return res;
}).catch(() => cached)
);
})
);
});