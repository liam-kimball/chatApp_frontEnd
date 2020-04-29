self.addEventListener('install', evt => {
    console.log('service worker is installed');
})


self.addEventListener('activate', evt => {
    console.log('service worker is activated');
})

self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data;

        const title = data.title;
        const options = {
            body: data.body,
        };

        event.waitUntil(
            self.registration.showNotification(title, options),
        );
    }
});
