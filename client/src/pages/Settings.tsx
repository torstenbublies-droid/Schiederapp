import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, BellOff, Loader2, ChevronLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

declare global {
  interface Window {
    OneSignal?: any;
  }
}

export default function Settings() {
  const { toast } = useToast();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oneSignalPlayerId, setOneSignalPlayerId] = useState<string | null>(null);

  const updatePushSettingsMutation = trpc.userNotifications.updatePushSettings.useMutation({
    onSuccess: () => {
      toast({
        title: "Einstellungen gespeichert",
        description: "Deine Push-Benachrichtigungs-Einstellungen wurden aktualisiert.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Die Einstellungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    checkPushStatus();
  }, []);

  const checkPushStatus = async () => {
    if (!('Notification' in window)) return;
    
    const permission = Notification.permission;
    const enabled = permission === 'granted';
    setPushEnabled(enabled);

    // Get OneSignal Player ID
    if (enabled && window.OneSignal) {
      try {
        const playerId = await window.OneSignal.User.PushSubscription.id;
        setOneSignalPlayerId(playerId);
        console.log('[Settings] OneSignal Player ID:', playerId);
      } catch (error) {
        console.error('[Settings] Error getting OneSignal ID:', error);
      }
    }
  };

  const handleTogglePush = async (checked: boolean) => {
    setIsLoading(true);

    try {
      if (checked) {
        // Enable push notifications
        if (!('Notification' in window)) {
          toast({
            title: "Nicht unterstützt",
            description: "Dein Browser unterstützt keine Push-Benachrichtigungen.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          // Subscribe to OneSignal
          if (window.OneSignal) {
            try {
              await window.OneSignal.Notifications.requestPermission();
              const playerId = await window.OneSignal.User.PushSubscription.id;
              
              // Update database
              await updatePushSettingsMutation.mutateAsync({
                oneSignalPlayerId: playerId,
                pushEnabled: true,
              });

              setPushEnabled(true);
              setOneSignalPlayerId(playerId);
              
              toast({
                title: "Aktiviert",
                description: "Push-Benachrichtigungen wurden erfolgreich aktiviert! 🎉",
              });
            } catch (error) {
              console.error('[Settings] OneSignal error:', error);
              toast({
                title: "Fehler",
                description: "Die Registrierung bei OneSignal ist fehlgeschlagen.",
                variant: "destructive",
              });
            }
          }
        } else if (permission === 'denied') {
          toast({
            title: "Blockiert",
            description: "Benachrichtigungen sind blockiert. Bitte erlaube sie in den Browser-Einstellungen.",
            variant: "destructive",
          });
        }
      } else {
        // Disable push notifications
        if (window.OneSignal) {
          try {
            await window.OneSignal.User.PushSubscription.optOut();
            
            // Update database
            await updatePushSettingsMutation.mutateAsync({
              oneSignalPlayerId: null,
              pushEnabled: false,
            });

            setPushEnabled(false);
            setOneSignalPlayerId(null);
            
            toast({
              title: "Deaktiviert",
              description: "Push-Benachrichtigungen wurden deaktiviert.",
            });
          } catch (error) {
            console.error('[Settings] Error disabling push:', error);
            toast({
              title: "Fehler",
              description: "Push-Benachrichtigungen konnten nicht deaktiviert werden.",
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.error('[Settings] Error:', error);
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Einstellungen</h1>
              <p className="text-blue-100 text-sm">Verwalte deine App-Einstellungen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Push Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push-Benachrichtigungen
            </CardTitle>
            <CardDescription>
              Erhalte wichtige Nachrichten und Updates direkt auf dein Gerät
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-toggle" className="text-base">
                  Benachrichtigungen aktivieren
                </Label>
                <p className="text-sm text-muted-foreground">
                  {pushEnabled 
                    ? "Du erhältst Push-Benachrichtigungen" 
                    : "Aktiviere Benachrichtigungen, um Updates zu erhalten"}
                </p>
              </div>
              <Switch
                id="push-toggle"
                checked={pushEnabled}
                onCheckedChange={handleTogglePush}
                disabled={isLoading}
              />
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Einstellungen werden aktualisiert...</span>
              </div>
            )}

            {pushEnabled && oneSignalPlayerId && (
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Subscription ID: <code className="bg-gray-100 px-2 py-1 rounded">{oneSignalPlayerId}</code>
                </p>
              </div>
            )}

            {!pushEnabled && (
              <div className="pt-4 border-t bg-blue-50 p-4 rounded-lg">
                <div className="flex gap-3">
                  <BellOff className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-900">
                      Verpasse keine wichtigen Updates!
                    </p>
                    <p className="text-sm text-blue-700">
                      Aktiviere Push-Benachrichtigungen, um über Neuigkeiten, Veranstaltungen und wichtige Mitteilungen informiert zu werden.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browser Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Browser-Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Benachrichtigungen unterstützt:</span>
              <span className="font-medium">
                {'Notification' in window ? '✅ Ja' : '❌ Nein'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Worker unterstützt:</span>
              <span className="font-medium">
                {'serviceWorker' in navigator ? '✅ Ja' : '❌ Nein'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Berechtigung:</span>
              <span className="font-medium">
                {Notification.permission === 'granted' && '✅ Erteilt'}
                {Notification.permission === 'denied' && '❌ Blockiert'}
                {Notification.permission === 'default' && '⏸️ Nicht gefragt'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

