// OneSignal Service Worker with Direct Database Storage
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

console.log('[Service Worker] OneSignal Service Worker initialized');

// Save notification directly to database via tRPC API
async function saveNotificationToDatabase(title, body, data) {
  try {
    console.log('[Service Worker] 💾 Saving notification to database...');
    console.log('[Service Worker] Title:', title);
    console.log('[Service Worker] Body:', body);
    console.log('[Service Worker] Data:', data);
    
    // Extract Player ID from push data
    // OneSignal includes player ID in the custom data
    let playerId = null;
    
    if (data) {
      // Try different possible locations for player ID
      playerId = data.oneSignalPlayerId || 
                 data.playerId || 
                 data.player_id ||
                 (data.custom && data.custom.i) ||
                 (data.additionalData && data.additionalData.playerId);
    }
    
    console.log('[Service Worker] Extracted Player ID from payload:', playerId);
    
    if (!playerId) {
      console.warn('[Service Worker] ⚠️ No Player ID in push payload');
      console.warn('[Service Worker] Full data object:', JSON.stringify(data));
      // Don't save if no player ID - we can't associate it with a user
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
    console.log('[Service Worker] Request Body:', JSON.stringify(requestBody));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('[Service Worker] ✅ Notification saved to database successfully:', result);
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
      console.log('[Service Worker] Full push payload:', JSON.stringify(payload, null, 2));
      
      title = payload.title || payload.heading || title;
      body = payload.body || payload.message || payload.alert || body;
      data = payload.data || payload.additionalData || payload.custom || payload;
    }
  } catch (e) {
    console.error('[Service Worker] Error parsing push data:', e);
  }
  
  // Save to database
  event.waitUntil(
    (async () => {
      const saved = await saveNotificationToDatabase(title, body, data);
      
      if (saved) {
        // Notify all open tabs that a new notification was saved
        const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
        clients.forEach(client => {
          client.postMessage({
            type: 'NOTIFICATION_SAVED',
            title: title,
            body: body,
          });
        });
      }
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

