import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, AlertCircle, Heart, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

// Mock-Daten für Demo-Zwecke
const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Einkaufen & Besorgungen", icon: "🛒", color: "#4CAF50" },
  { id: "cat-2", name: "Haushalt & Handwerk", icon: "🔧", color: "#FF9800" },
  { id: "cat-3", name: "Kinder & Familie", icon: "👶", color: "#E91E63" },
  { id: "cat-4", name: "Seniorenhilfe & Begleitung", icon: "👴", color: "#9C27B0" },
  { id: "cat-5", name: "Tiere & Gassi gehen", icon: "🐕", color: "#795548" },
  { id: "cat-6", name: "Technik & Bürokratie", icon: "💻", color: "#2196F3" },
  { id: "cat-7", name: "Leihen & Teilen", icon: "🤝", color: "#00BCD4" },
];

const MOCK_REQUESTS = [
  {
    id: "1",
    type: "request",
    categoryId: "cat-1",
    title: "Hilfe beim Wocheneinkauf gesucht",
    description: "Ich bin 78 Jahre alt und benötige Unterstützung beim wöchentlichen Einkauf im Supermarkt.",
    locationStreet: "Bahnhofstraße",
    durationMinutes: 60,
    isUrgent: false,
    compensation: "kostenlos",
    createdAt: new Date("2024-12-07"),
  },
  {
    id: "2",
    type: "request",
    categoryId: "cat-2",
    title: "Glühbirne wechseln in hoher Decke",
    description: "Ich komme nicht mehr an die Deckenlampe im Flur. Die Glühbirne ist kaputt.",
    locationStreet: "Kirchstraße",
    durationMinutes: 15,
    isUrgent: true,
    compensation: "Kaffee und Kuchen",
    createdAt: new Date("2024-12-06"),
  },
];

const MOCK_OFFERS = [
  {
    id: "3",
    type: "offer",
    categoryId: "cat-1",
    title: "Biete Einkaufshilfe an",
    description: "Ich gehe regelmäßig einkaufen und kann gerne für ältere Menschen miteinkaufen.",
    locationStreet: "Hauptstraße",
    durationMinutes: 60,
    isUrgent: false,
    compensation: "kostenlos",
    createdAt: new Date("2024-12-05"),
  },
  {
    id: "4",
    type: "offer",
    categoryId: "cat-2",
    title: "Handwerkliche Hilfe - Kleinreparaturen",
    description: "Ich bin gelernter Schreiner und biete Hilfe bei kleineren Reparaturen im Haushalt an.",
    locationStreet: "Emmerstraße",
    durationMinutes: 120,
    isUrgent: false,
    compensation: "nach Vereinbarung",
    createdAt: new Date("2024-12-04"),
  },
];

export default function NeighborhoodHelp() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getCategoryById = (id: string) => MOCK_CATEGORIES.find(c => c.id === id);

  const filterByCategory = (items: typeof MOCK_REQUESTS) => {
    if (!selectedCategory) return items;
    return items.filter(item => item.categoryId === selectedCategory);
  };

  const HelpCard = ({ item }: { item: typeof MOCK_REQUESTS[0] }) => {
    const category = getCategoryById(item.categoryId);
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{category?.icon}</span>
                <Badge variant="outline" style={{ borderColor: category?.color }}>
                  {category?.name}
                </Badge>
                {item.isUrgent && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Dringend
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </div>
          </div>
          <CardDescription className="flex items-center gap-4 text-sm mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {item.locationStreet}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {item.durationMinutes} Min.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              💰 {item.compensation}
            </span>
            <Button size="sm" variant={item.type === "request" ? "default" : "outline"}>
              {item.type === "request" ? "Hilfe anbieten" : "Kontaktieren"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Button>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary" />
          Nachbarschaftshilfe
        </h1>
        <p className="text-muted-foreground">
          Helfen Sie Ihren Nachbarn oder finden Sie Unterstützung in Ihrer Nähe
        </p>
      </div>

      {/* Kategorien Filter */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-3">Kategorien</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Alle
          </Button>
          {MOCK_CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center gap-1"
            >
              <span>{cat.icon}</span>
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs für Gesuche und Angebote */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="requests">
            Gesuche ({filterByCategory(MOCK_REQUESTS).length})
          </TabsTrigger>
          <TabsTrigger value="offers">
            Angebote ({filterByCategory(MOCK_OFFERS).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <div className="grid gap-4 md:grid-cols-2">
            {filterByCategory(MOCK_REQUESTS).map((item) => (
              <HelpCard key={item.id} item={item} />
            ))}
          </div>
          {filterByCategory(MOCK_REQUESTS).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Keine Gesuche in dieser Kategorie gefunden
            </div>
          )}
        </TabsContent>

        <TabsContent value="offers">
          <div className="grid gap-4 md:grid-cols-2">
            {filterByCategory(MOCK_OFFERS).map((item) => (
              <HelpCard key={item.id} item={item} />
            ))}
          </div>
          {filterByCategory(MOCK_OFFERS).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Keine Angebote in dieser Kategorie gefunden
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Info-Banner */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ Demo-Modus:</strong> Dies ist eine Vorschau der Nachbarschaftshilfe-Funktion mit Beispieldaten. 
            Die vollständige Funktionalität mit Datenbank wird in Kürze verfügbar sein.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
