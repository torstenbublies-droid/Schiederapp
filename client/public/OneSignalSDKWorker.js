// OneSignal Service Worker with Direct Database Storage
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

console.log('[Service Worker] OneSignal Service Worker initialized');

// Get OneSignal Player ID from IndexedDB
async function getPlayerIdFromIndexedDB() {
  try {
    // OneSignal stores the player ID in its own IndexedDB
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('OneSignal-db');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    const transaction = db.transaction(['Ids'], 'readonly');
    const store = transaction.objectStore('Ids');
    const request = store.get('userId');
    
    const result = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    return result?.value || null;
  } catch (error) {
    console.error('[Service Worker] Error getting Player ID from IndexedDB:', error);
    return null;
  }
}

// Save notification directly to database via tRPC API
async function saveNotificationToDatabase(title, body, data, playerId) {
  try {
    console.log('[Service Worker] Saving notification to database...');
    console.log('[Service Worker] Player ID:', playerId);
    console.log('[Service Worker] Title:', title);
    console.log('[Service Worker] Body:', body);
    
    if (!playerId) {
      console.warn('[Service Worker] No Player ID, cannot save to database');
      return false;
    }
    
    // Generate unique ID
    const notificationId = 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Prepare tRPC request
    const apiUrl = self.location.origin + '/api/trpc/userNotifications.create';
    
    const requestBody = {
      oneSignalPlayerId: playerId,
      id: notificationId,
      title: title,
      message: body,
      type: (data && data.type) || 'info',
      data: data || null,
    };
    
    console.log('[Service Worker] API Request:', apiUrl);
    console.log('[Service Worker] Request Body:', requestBody);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (response.ok) {
      console.log('[Service Worker] ✅ Notification saved to database successfully');
      return true;
    } else {
      const errorText = await response.text();
      console.error('[Service Worker] ❌ Failed to save notification:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('[Service Worker] ❌ Error saving notification to database:', error);
    return false;
  }
}

// Listen for push events
self.addEventListener('push', async function(event) {
  console.log('[Service Worker] 📨 Push event received');
  
  let title = 'Schieder-Schwalenberg';
  let body = 'Neue Nachricht';
  let data = null;
  
  try {
    if (event.data) {
      const payload = event.data.json();
      console.log('[Service Worker] Push payload:', payload);
      
      title = payload.title || payload.heading || title;
      body = payload.body || payload.message || payload.alert || body;
      data = payload.data || payload.additionalData || payload.custom || null;
    }
  } catch (e) {
    console.error('[Service Worker] Error parsing push data:', e);
  }
  
  // Get Player ID and save to database
  event.waitUntil(
    (async () => {
      const playerId = await getPlayerIdFromIndexedDB();
      await saveNotificationToDatabase(title, body, data, playerId);
      
      // Notify all open tabs
      const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
      clients.forEach(client => {
        client.postMessage({
          type: 'NOTIFICATION_SAVED',
          title: title,
          body: body,
        });
      });
    })()
  );
});

// Listen for notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();
  
  const urlToOpen = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : self.location.origin + '/notifications';
  
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});

