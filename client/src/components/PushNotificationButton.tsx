import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    OneSignal?: any;
    OneSignalDeferred?: Array<(oneSignal: any) => void>;
  }
}

export default function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already subscribed
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async function(OneSignal: any) {
        try {
          const isPushSupported = OneSignal.Notifications.isPushSupported();
          if (isPushSupported) {
            const permission = await OneSignal.Notifications.permissionNative;
            setIsSubscribed(permission === 'granted');
          }
        } catch (error) {
          console.error('Error checking OneSignal status:', error);
        } finally {
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleEnablePush = async () => {
    if (!window.OneSignalDeferred) {
      console.error('OneSignal not loaded');
      return;
    }

    window.OneSignalDeferred.push(async function(OneSignal: any) {
      try {
        await OneSignal.Slidedown.promptPush();
        console.log('Push notification prompt opened');
        
        // Check subscription status after prompt
        setTimeout(async () => {
          const permission = await OneSignal.Notifications.permissionNative;
          setIsSubscribed(permission === 'granted');
        }, 1000);
      } catch (error) {
        console.error('Error opening push notification prompt:', error);
      }
    });
  };

  if (isLoading) {
    return null;
  }

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
        <Bell size={16} className="animate-pulse" />
        <span>Benachrichtigungen aktiviert</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleEnablePush}
      variant="outline"
      className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
    >
      <Bell size={16} />
      <span>🔔 Benachrichtigungen aktivieren</span>
    </Button>
  );
}

