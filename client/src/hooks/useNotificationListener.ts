import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { nanoid } from 'nanoid';

/**
 * Hook that listens for service worker messages to save notifications
 */
export function useNotificationListener() {
  const utils = trpc.useUtils();

  useEffect(() => {
    // Listen for messages from service worker
    const handleMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'SAVE_NOTIFICATION') {
        const { notification } = event.data;
        
        console.log('[Notification Listener] Received notification to save:', notification);
        
        try {
          // Save notification to database via tRPC
          const response = await fetch('/api/trpc/userNotifications.create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: nanoid(),
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

