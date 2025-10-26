// OneSignal Service Worker for Push Notifications
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Helper function to save notification to database
async function saveNotificationToDatabase(title, body, data) {
  try {
    // Get all clients (open tabs/windows)
    const allClients = await clients.matchAll({ includeUncontrolled: true, type: 'window' });
    
    if (allClients.length > 0) {
      // Send message to the first client to save notification
      allClients[0].postMessage({
        type: 'SAVE_NOTIFICATION',
        notification: {
          title: title,
          message: body,
          data: data
        }
      });
      console.log('[Service Worker] Sent notification to client for saving');
    } else {
      console.log('[Service Worker] No clients available to save notification');
    }
  } catch (error) {
    console.error('[Service Worker] Error saving notification:', error);
  }
}

// Add push event handler
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push event received');
  
  let title = 'Schieder-Schwalenberg';
  let options = {
    body: 'Neue Nachricht',
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };
  
  let notificationData = null;
  
  try {
    if (event.data) {
      const data = event.data.json();
      console.log('[Service Worker] Push data:', data);
      
      // Handle OneSignal format
      if (data.title) title = data.title;
      if (data.body) options.body = data.body;
      if (data.message) options.body = data.message;
      if (data.icon) options.icon = data.icon;
      if (data.url) {
        options.data = { url: data.url };
        notificationData = data;
      }
    }
  } catch (e) {
    console.log('[Service Worker] Using text data');
    try {
      if (event.data) {
        options.body = event.data.text();
      }
    } catch (e2) {
      console.error('[Service Worker] Error reading push data:', e2);
    }
  }
  
  console.log('[Service Worker] Showing notification with:', { title, options });
  
  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options)
        .then(() => console.log('[Service Worker] Notification shown successfully'))
        .catch(err => console.error('[Service Worker] Error showing notification:', err)),
      saveNotificationToDatabase(title, options.body, notificationData)
    ])
  );
});

// Add notification click handler
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();
  
  const urlToOpen = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : 'https://schiederapp.onrender.com/';
  
  event.waitUntil(
    clients.openWindow(urlToOpen)
      .then(() => console.log('[Service Worker] Window opened'))
      .catch(err => console.error('[Service Worker] Error opening window:', err))
  );
});

// Add message handler
self.addEventListener('message', function(event) {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[Service Worker] OneSignal Service Worker initialized');

