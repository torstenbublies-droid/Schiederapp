import { useEffect, useState } from 'react';

declare global {
  interface Window {
    OneSignal?: any;
    OneSignalDeferred?: Array<(oneSignal: any) => void>;
  }
}

export default function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already subscribed
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    if (!('Notification' in window)) return;
    
    const permission = Notification.permission;
    setIsSubscribed(permission === 'granted');
  };

  const handleEnablePush = async () => {
    setIsLoading(true);
    
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        alert('Dein Browser unterstützt keine Push-Benachrichtigungen.');
        setIsLoading(false);
        return;
      }

      // Check if service worker is supported
      if (!('serviceWorker' in navigator)) {
        alert('Dein Browser unterstützt keine Service Worker.');
        setIsLoading(false);
        return;
      }

      // Check current permission
      const currentPermission = Notification.permission;
      console.log('[Push] Current permission:', currentPermission);

      if (currentPermission === 'denied') {
        alert('Benachrichtigungen sind blockiert. Bitte erlaube sie in den Browser-Einstellungen (Schloss-Icon → Benachrichtigungen).');
        setIsLoading(false);
        return;
      }

      if (currentPermission === 'granted') {
        alert('Du hast Benachrichtigungen bereits aktiviert! ✅');
        setIsSubscribed(true);
        setIsLoading(false);
        return;
      }

      // Request permission using native browser API
      console.log('[Push] Requesting permission...');
      const permission = await Notification.requestPermission();
      console.log('[Push] Permission result:', permission);

      if (permission === 'granted') {
        console.log('[Push] Permission granted! Subscribing to OneSignal...');
        
        // Wait for OneSignal to be ready
        if (window.OneSignal) {
          try {
            // Subscribe to OneSignal
            await window.OneSignal.Notifications.requestPermission();
            console.log('[Push] OneSignal subscription successful!');
            
            setIsSubscribed(true);
            alert('Benachrichtigungen erfolgreich aktiviert! 🎉');
          } catch (error) {
            console.error('[Push] OneSignal subscription error:', error);
            alert('Benachrichtigungen wurden erlaubt, aber die Registrierung bei OneSignal ist fehlgeschlagen.');
          }
        } else {
          console.warn('[Push] OneSignal not available');
          alert('Benachrichtigungen wurden erlaubt, aber OneSignal ist noch nicht geladen.');
        }
      } else if (permission === 'denied') {
        alert('Du hast Benachrichtigungen abgelehnt. Du kannst sie später in den Browser-Einstellungen aktivieren.');
      } else {
        console.log('[Push] Permission dismissed');
      }
    } catch (error) {
      console.error('[Push] Error:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if already subscribed
  if (isSubscribed) {
    return null;
  }

  return (
    <button
      onClick={handleEnablePush}
      disabled={isLoading}
      style={{
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        border: 'none',
        backgroundColor: '#3b82f6',
        color: 'white',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: isLoading ? 'wait' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        margin: '1rem auto',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        opacity: isLoading ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      {isLoading ? (
        <>⏳ Lädt...</>
      ) : (
        <>🔔 Benachrichtigungen aktivieren</>
      )}
    </button>
  );
}

