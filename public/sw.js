// Service worker mínimo: solo habilita la instalación de la PWA.
// No cachea nada — la app siempre necesita conexión para leer/guardar datos.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // passthrough: deja que el navegador maneje el request normalmente.
});
