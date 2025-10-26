// OneSignal Service Worker with Notification Storage
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// IndexedDB for storing notifications
const DB_NAME = 'NotificationStorage';
const DB_VERSION = 1;
const STORE_NAME = 'pendingNotifications';

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Store notification in IndexedDB
async function storeNotification(title, body, data) {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const notification = {
      title: title,
      body: body,
      data: data,
      timestamp: Date.now()
    };
    
    store.add(notification);
    
    await new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    
    console.log('[Service Worker] Notification stored in IndexedDB:', notification);
    
    // Notify all clients
    const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
    clients.forEach(client => {
      client.postMessage({
        type: 'NEW_NOTIFICATION',
        notification: notification
      });
    });
    
  } catch (error) {
    console.error('[Service Worker] Error storing notification:', error);
  }
}

// Listen for push events
self.addEventListener('push', async function(event) {
  console.log('[Service Worker] Push event received');
  
  let title = 'Schieder-Schwalenberg';
  let body = 'Neue Nachricht';
  let data = null;
  
  try {
    if (event.data) {
      const payload = event.data.json();
      console.log('[Service Worker] Push payload:', payload);
      
      title = payload.title || payload.heading || title;
      body = payload.body || payload.message || payload.alert || body;
      data = payload.data || payload.additionalData || null;
    }
  } catch (e) {
    console.error('[Service Worker] Error parsing push data:', e);
  }
  
  // Store notification
  event.waitUntil(storeNotification(title, body, data));
});

// Listen for notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();
  
  const urlToOpen = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : 'https://schiederapp.onrender.com/notifications';
  
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});

console.log('[Service Worker] OneSignal Service Worker with notification storage initialized');

