import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useOneSignalPlayerId } from './useOneSignalPlayerId';
import { nanoid } from 'nanoid';

declare global {
  interface Window {
    OneSignal?: any;
  }
}

/**
 * Hook that listens for service worker messages to save notifications
 */
export function useNotificationListener() {
  const utils = trpc.useUtils();
  const { playerId } = useOneSignalPlayerId();
  const createNotificationMutation = trpc.userNotifications.create.useMutation();

  useEffect(() => {
    // Listen for OneSignal notification events
    const setupOneSignalListener = async () => {
      if (!window.OneSignal) {
        console.log('[Notification Listener] OneSignal not available yet');
        return;
      }

      try {
        await window.OneSignal.Notifications.addEventListener('foregroundWillDisplay', async (event: any) => {
          console.log('[Notification Listener] Foreground notification received:', event);
          
          const notification = event.notification;
          const playerIdToUse = playerId || localStorage.getItem('oneSignalPlayerId');
          
          if (!playerIdToUse) {
            console.warn('[Notification Listener] No OneSignal Player ID available');
            return;
          }

          try {
            // Save notification to database
            await createNotificationMutation.mutateAsync({
              oneSignalPlayerId: playerIdToUse,
              title: notification.title || 'Benachrichtigung',
              message: notification.body || '',
              type: 'info',
              data: notification.additionalData ? JSON.stringify(notification.additionalData) : null,
            });

            console.log('[Notification Listener] Notification saved successfully');
            
            // Invalidate queries to refresh notification list
            utils.userNotifications.list.invalidate();
            utils.userNotifications.unreadCount.invalidate();
          } catch (error) {
            console.error('[Notification Listener] Error saving notification:', error);
          }
        });

        console.log('[Notification Listener] OneSignal listener registered');
      } catch (error) {
        console.error('[Notification Listener] Error setting up OneSignal listener:', error);
      }
    };

    setupOneSignalListener();

    // Fallback: Listen for messages from service worker (legacy)
    const handleMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'SAVE_NOTIFICATION') {
        const { notification } = event.data;
        
        console.log('[Notification Listener] Received notification to save:', notification);
        
        // Get OneSignal Player ID from localStorage or event data
        const storedPlayerId = localStorage.getItem('oneSignalPlayerId');
        const playerIdToUse = notification.oneSignalPlayerId || storedPlayerId;
        
        if (!playerIdToUse) {
          console.warn('[Notification Listener] No OneSignal Player ID available');
          return;
        }

        try {
          // Save notification to database via tRPC
          const response = await fetch('/api/trpc/userNotifications.create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              oneSignalPlayerId: playerIdToUse,
              title: notification.title,
              message: notification.message,
              type: 'info',
              data: notification.data ? JSON.stringify(notification.data) : null,
            }),
          });

          if (response.ok) {
            console.log('[Notification Listener] Notification saved successfully');
            // Invalidate queries to refresh notification list
            utils.userNotifications.list.invalidate();
            utils.userNotifications.unreadCount.invalidate();
          } else {
            console.error('[Notification Listener] Failed to save notification:', response.statusText);
          }
        } catch (error) {
          console.error('[Notification Listener] Error saving notification:', error);
        }
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [utils]);
}

