// OneSignal Service Worker for Push Notifications
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Listen for notification display events from OneSignal
self.addEventListener('notificationclick', async function(event) {
  console.log('[Service Worker] Notification clicked:', event.notification);
  
  event.notification.close();
  
  // Get notification data
  const notificationData = event.notification.data || {};
  const title = event.notification.title;
  const body = event.notification.body;
  
  // Save notification to database
  await saveNotificationToDatabase(title, body, notificationData);
  
  // Open URL
  const urlToOpen = notificationData.url || 'https://schiederapp.onrender.com/';
  
  event.waitUntil(
    clients.openWindow(urlToOpen)
      .then(() => console.log('[Service Worker] Window opened'))
      .catch(err => console.error('[Service Worker] Error opening window:', err))
  );
});

// Listen for when OneSignal shows a notification
self.addEventListener('push', async function(event) {
  console.log('[Service Worker] Push event received');
  
  // Let OneSignal handle the notification display
  // We'll save it to database when it's clicked or displayed
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[Service Worker] Push data:', data);
      
      const title = data.title || data.heading || 'Schieder-Schwalenberg';
      const body = data.body || data.message || data.alert || 'Neue Nachricht';
      
      // Save to database immediately
      await saveNotificationToDatabase(title, body, data);
    } catch (e) {
      console.error('[Service Worker] Error processing push:', e);
    }
  }
});

// Helper function to save notification to database
async function saveNotificationToDatabase(title, body, data) {
  try {
    console.log('[Service Worker] Saving notification:', { title, body, data });
    
    // Get OneSignal Player ID from IndexedDB
    let oneSignalPlayerId = null;
    
    // Try to get from notification data
    if (data && data.oneSignalPlayerId) {
      oneSignalPlayerId = data.oneSignalPlayerId;
    }
    
    // Try to get from IndexedDB
    if (!oneSignalPlayerId) {
      try {
        const db = await openIndexedDB();
        oneSignalPlayerId = await getPlayerIdFromIndexedDB(db);
      } catch (e) {
        console.log('[Service Worker] Could not get Player ID from IndexedDB:', e);
      }
    }
    
    // Get all clients (open tabs/windows)
    const allClients = await clients.matchAll({ includeUncontrolled: true, type: 'window' });
    
    if (allClients.length > 0) {
      // Send message to all clients to save notification
      allClients.forEach(client => {
        client.postMessage({
          type: 'SAVE_NOTIFICATION',
          notification: {
            title: title,
            message: body,
            data: data,
            oneSignalPlayerId: oneSignalPlayerId
          }
        });
      });
      console.log('[Service Worker] Sent notification to clients for saving');
    } else {
      console.log('[Service Worker] No clients available to save notification');
    }
  } catch (error) {
    console.error('[Service Worker] Error saving notification:', error);
  }
}

// Helper to open IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ONE_SIGNAL_SDK_DB');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Helper to get Player ID from IndexedDB
function getPlayerIdFromIndexedDB(db) {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(['Ids'], 'readonly');
      const store = transaction.objectStore('Ids');
      const request = store.get('userId');
      
      request.onsuccess = () => {
        const playerId = request.result;
        console.log('[Service Worker] Player ID from IndexedDB:', playerId);
        resolve(playerId);
      };
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
}

console.log('[Service Worker] OneSignal Service Worker initialized with custom handlers');

