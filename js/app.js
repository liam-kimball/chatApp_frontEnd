if('serviceWorker' in navigator)
{
    navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('Service Worker Registered', reg))
    .catch((err) => console.log('service worker not registered', err));
}
