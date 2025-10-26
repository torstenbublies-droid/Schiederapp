import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useOneSignalPlayerId } from './useOneSignalPlayerId';

declare global {
  interface Window {
    OneSignal?: any;
  }
}

const DB_NAME = 'NotificationStorage';
const STORE_NAME = 'pendingNotifications';

/**
 * Hook that syncs notifications from IndexedDB to database
 */
export function useNotificationListener() {
  const utils = trpc.useUtils();
  const { playerId } = useOneSignalPlayerId();
  const createNotificationMutation = trpc.userNotifications.create.useMutation();

  useEffect(() => {
    // Function to sync pending notifications from IndexedDB to database
    const syncPendingNotifications = async () => {
      const playerIdToUse = playerId || localStorage.getItem('oneSignalPlayerId');
      
      if (!playerIdToUse) {
        console.log('[Notification Sync] No Player ID yet, skipping sync');
        return;
      }

      try {
        // Open IndexedDB
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open(DB_NAME);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        // Get all pending notifications
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const getAllRequest = store.getAll();

        const notifications = await new Promise<any[]>((resolve, reject) => {
          getAllRequest.onsuccess = () => resolve(getAllRequest.result);
          getAllRequest.onerror = () => reject(getAllRequest.error);
        });

        console.log('[Notification Sync] Found', notifications.length, 'pending notifications');

        // Save each notification to database
        for (const notification of notifications) {
          try {
            await createNotificationMutation.mutateAsync({
              oneSignalPlayerId: playerIdToUse,
              title: notification.title || 'Benachrichtigung',
              message: notification.body || '',
              type: 'info',
              data: notification.data ? JSON.stringify(notification.data) : null,
            });

            console.log('[Notification Sync] Saved notification:', notification.title);

            // Delete from IndexedDB after successful save
            const deleteTransaction = db.transaction([STORE_NAME], 'readwrite');
            const deleteStore = deleteTransaction.objectStore(STORE_NAME);
            deleteStore.delete(notification.id);
          } catch (error) {
            console.error('[Notification Sync] Error saving notification:', error);
          }
        }

        if (notifications.length > 0) {
          // Invalidate queries to refresh UI
          utils.userNotifications.list.invalidate();
          utils.userNotifications.unreadCount.invalidate();
        }

        db.close();
      } catch (error) {
        console.error('[Notification Sync] Error syncing notifications:', error);
      }
    };

    // Listen for messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NEW_NOTIFICATION') {
        console.log('[Notification Sync] New notification from service worker');
        // Sync immediately when we get a new notification
        syncPendingNotifications();
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);

    // Sync on mount
    syncPendingNotifications();

    // Sync periodically (every 10 seconds)
    const intervalId = setInterval(syncPendingNotifications, 10000);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
      clearInterval(intervalId);
    };
  }, [playerId, createNotificationMutation, utils]);
}

