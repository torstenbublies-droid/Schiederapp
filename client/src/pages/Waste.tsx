import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, Trash2, Bell, BellOff, Recycle } from "lucide-react";
import { Link } from "wouter";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { de } from "date-fns/locale";
import { toast } from "sonner";

interface WasteType {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const wasteTypes: WasteType[] = [
  { id: "Restmüll", name: "Restmüll", color: "bg-gray-700", icon: "🗑️" },
  { id: "Biomüll", name: "Biomüll", color: "bg-green-600", icon: "🌱" },
  { id: "Papier", name: "Papier", color: "bg-blue-600", icon: "📄" },
  { id: "Gelber_Sack", name: "Gelber Sack", color: "bg-yellow-500", icon: "♻️" },
];

export default function Waste() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { data: upcomingCollections, isLoading } = trpc.waste.upcoming.useQuery();
  const toggleNotifications = trpc.waste.toggleNotifications.useMutation();

  useEffect(() => {
    // Check if notifications are enabled
    const enabled = localStorage.getItem("wasteNotificationsEnabled") === "true";
    setNotificationsEnabled(enabled);
  }, []);

  const handleToggleNotifications = async () => {
    const newState = !notificationsEnabled;
    
    try {
      await toggleNotifications.mutateAsync({ enabled: newState });
      setNotificationsEnabled(newState);
      localStorage.setItem("wasteNotificationsEnabled", String(newState));
      
      if (newState) {
        toast.success("Benachrichtigungen aktiviert", {
          description: "Sie erhalten täglich um 18 Uhr eine Erinnerung für die Abfuhr am nächsten Tag."
        });
      } else {
        toast.success("Benachrichtigungen deaktiviert");
      }
    } catch (error) {
      toast.error("Fehler beim Ändern der Benachrichtigungseinstellungen");
    }
  };

  const getNextCollectionDate = (wasteType: string) => {
    if (!upcomingCollections) return null;
    const collection = upcomingCollections.find((c: any) => c.wasteType === wasteType);
    return collection ? new Date(collection.collectionDate) : null;
  };

  const formatCollectionDate = (date: Date | null) => {
    if (!date) return "Kein Termin";
    if (isToday(date)) return "Heute";
    if (isTomorrow(date)) return "Morgen";
    return format(date, "dd.MM.yyyy", { locale: de });
  };

  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  const getCollectionsForDate = (date: Date) => {
    if (!upcomingCollections) return [];
    return upcomingCollections.filter((c: any) => {
      const collectionDate = new Date(c.collectionDate);
      return collectionDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-green-600 text-white py-6">
        <div className="container">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2 text-white hover:bg-white/20">
              <ArrowLeft size={16} className="mr-2" />
              Zurück
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Abfallkalender</h1>
          <p className="text-white/90 mt-1">Abfuhrtermine für Schieder-Schwalenberg</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Benachrichtigungen Toggle */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notificationsEnabled ? <Bell size={24} className="text-primary" /> : <BellOff size={24} className="text-muted-foreground" />}
              <div>
                <Label htmlFor="notifications" className="text-base font-semibold cursor-pointer">
                  Erinnerungen aktivieren
                </Label>
                <p className="text-sm text-muted-foreground">
                  Erhalten Sie täglich um 18 Uhr eine Benachrichtigung für die Abfuhr am nächsten Tag
                </p>
              </div>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
            />
          </div>
        </Card>

        {/* Mülltonnen Kacheln */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Nächste Abfuhrtermine</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {wasteTypes.map((type) => {
              const nextDate = getNextCollectionDate(type.id);
              const dateText = formatCollectionDate(nextDate);
              const isUpcoming = nextDate && (isToday(nextDate) || isTomorrow(nextDate));

              return (
                <Card key={type.id} className={`p-6 text-center ${isUpcoming ? 'ring-2 ring-primary' : ''}`}>
                  <div className={`${type.color} text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3`}>
                    {type.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{type.name}</h3>
                  <div className={`text-sm ${isUpcoming ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    {dateText}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Wochenübersicht */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Diese Woche</h2>
          <div className="grid gap-3">
            {getNextSevenDays().map((date, index) => {
              const collections = getCollectionsForDate(date);
              const dayLabel = index === 0 ? "Heute" : index === 1 ? "Morgen" : format(date, "EEEE", { locale: de });

              return (
                <Card key={index} className={`p-4 ${collections.length > 0 ? 'bg-muted/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{dayLabel}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(date, "dd. MMMM yyyy", { locale: de })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {collections.length > 0 ? (
                        collections.map((collection: any, idx: number) => {
                          const type = wasteTypes.find(t => t.id === collection.wasteType);
                          return (
                            <div
                              key={idx}
                              className={`${type?.color || 'bg-gray-600'} text-white px-4 py-2 rounded-lg flex items-center gap-2`}
                            >
                              <span className="text-xl">{type?.icon}</span>
                              <span className="font-medium">{type?.name || collection.wasteType}</span>
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-muted-foreground text-sm">Keine Abfuhr</span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Recycle size={24} className="text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Abfallberatung</h3>
              <p className="text-sm text-blue-800 mb-2">
                Abfallberatung ABG Lippe mbH
              </p>
              <p className="text-sm text-blue-800">
                Tel.: 05261 948720<br />
                Internet: www.abfall-lippe.de
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

