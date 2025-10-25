// OneSignal Service Worker for Push Notifications
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Add push event handler
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push received:', event);
  
  let notificationData = {};
  
  try {
    if (event.data) {
      notificationData = event.data.json();
      console.log('[Service Worker] Push data:', notificationData);
    }
  } catch (e) {
    console.error('[Service Worker] Error parsing push data:', e);
    notificationData = {
      title: 'Neue Benachrichtigung',
      body: event.data ? event.data.text() : 'Sie haben eine neue Nachricht erhalten.'
    };
  }
  
  const title = notificationData.title || 'Schieder-Schwalenberg';
  const options = {
    body: notificationData.body || notificationData.message || 'Neue Nachricht',
    icon: notificationData.icon || '/icon-192.png',
    badge: notificationData.badge || '/icon-192.png',
    data: notificationData.data || {},
    tag: notificationData.tag || 'default',
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };
  
  console.log('[Service Worker] Showing notification:', title, options);
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Add notification click handler
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();
  
  // Open the app when notification is clicked
  event.waitUntil(
    clients.openWindow(event.notification.data.url || 'https://schiederapp.onrender.com/')
  );
});

// Add message handler
self.addEventListener('message', function(event) {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[Service Worker] OneSignal Service Worker loaded and ready');

