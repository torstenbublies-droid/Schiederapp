import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Bell, BellOff } from 'lucide-react';

declare global {
  interface Window {
    OneSignal?: any;
  }
}

export default function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    if (!('Notification' in window)) return;
    
    const permission = Notification.permission;
    setIsSubscribed(permission === 'granted');
  };

  const handleToggle = async () => {
    if (isSubscribed) {
      // Show info how to disable
      alert('Um Benachrichtigungen zu deaktivieren, klicke auf das Schloss-Symbol in der Adressleiste und ändere die Benachrichtigungs-Einstellung.');
      return;
    }

    // Enable push
    setIsLoading(true);
    
    try {
      if (!('Notification' in window)) {
        alert('Dein Browser unterstützt keine Push-Benachrichtigungen.');
        setIsLoading(false);
        return;
      }

      const currentPermission = Notification.permission;

      if (currentPermission === 'denied') {
        alert('Benachrichtigungen sind blockiert. Bitte erlaube sie in den Browser-Einstellungen.');
        setIsLoading(false);
        return;
      }

      // Request permission
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        // Subscribe to OneSignal
        if (window.OneSignal) {
          try {
            await window.OneSignal.Notifications.requestPermission();
            setIsSubscribed(true);
            alert('Benachrichtigungen aktiviert! 🎉');
          } catch (error) {
            console.error('[Push] OneSignal error:', error);
          }
        }
      }
    } catch (error) {
      console.error('[Push] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isSubscribed ? "secondary" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <>⏳ Lädt...</>
      ) : isSubscribed ? (
        <>
          <Bell className="h-4 w-4" />
          Aktiviert
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4" />
          Aktivieren
        </>
      )}
    </Button>
  );
}

