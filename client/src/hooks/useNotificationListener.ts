import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useOneSignalPlayerId } from './useOneSignalPlayerId';

/**
 * Hook that listens for push notifications from the service worker
 * and saves them to the database
 */
export function useNotificationListener() {
  const utils = trpc.useUtils();
  const { playerId } = useOneSignalPlayerId();
  const createNotificationMutation = trpc.userNotifications.create.useMutation();

  useEffect(() => {
    // Listen for messages from service worker
    const handleMessage = async (event: MessageEvent) => {
      // Only handle messages from our service worker
      if (event.data && event.data.type === 'PUSH_NOTIFICATION_RECEIVED') {
        console.log('[Notification Listener] Received notification from service worker:', event.data);
        
        if (!playerId) {
          console.warn('[Notification Listener] No Player ID yet, cannot save notification');
          return;
        }
        
        try {
          // Generate unique ID
          const notificationId = 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          
          // Save to database
          await createNotificationMutation.mutateAsync({
            oneSignalPlayerId: playerId,
            id: notificationId,
            title: event.data.title,
            message: event.data.body,
            type: event.data.data?.type || 'info',
            data: event.data.data || null,
          });
          
          console.log('[Notification Listener] ✅ Notification saved to database');
          
          // Invalidate queries to update UI
          utils.userNotifications.list.invalidate();
          utils.userNotifications.unreadCount.invalidate();
        } catch (error) {
          console.error('[Notification Listener] ❌ Error saving notification:', error);
        }
      }
    };

    // Register message listener
    navigator.serviceWorker?.addEventListener('message', handleMessage);
    console.log('[Notification Listener] Registered service worker message listener');

    // Cleanup
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [playerId, createNotificationMutation, utils]);
}

