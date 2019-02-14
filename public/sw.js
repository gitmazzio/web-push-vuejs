'use strict';

this.addEventListener('install', function() {
    console.log('Installed service worker');
});


/* Handle push event */
this.addEventListener('push', (event) => {
    // console.log('[Service Worker] Push Received.');
    // console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    /* Parse notification payload */
    let pushData = JSON.parse(event.data.text());

    /* Show push notification */
    event.waitUntil(self.registration.showNotification(pushData.title, pushData.options));
});

/* Handle click on notification */
this.addEventListener('notificationclick', (event) => {
    event.notification.close();

    /* Open url in a new window */
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});