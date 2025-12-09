import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, HelpCircle, HandHelping, MapPin, User, 
  AlertCircle, ChevronDown, Filter, List
} from "lucide-react";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Mock-Daten
const CATEGORIES = [
  { id: "all", name: "Alle Kategorien", emoji: "📋" },
  { id: "shopping", name: "Einkaufen", emoji: "🛒" },
  { id: "transport", name: "Fahrdienste", emoji: "🚗" },
  { id: "childcare", name: "Kinderbetreuung", emoji: "👶" },
  { id: "companionship", name: "Begleitung", emoji: "🤝" },
  { id: "garden", name: "Haus & Garten", emoji: "🏡" },
  { id: "tech", name: "Technik-Hilfe", emoji: "💻" },
  { id: "pets", name: "Haustierbetreuung", emoji: "🐕" },
  { id: "other", name: "Sonstiges", emoji: "📌" },
];

const MOCK_REQUESTS = [
  {
    id: "1",
    title: "Hilfe beim Einkaufen gesucht",
    description: "Hallo zusammen, ich bin 82 und suche jemanden, der mir einmal pro Woche beim Einkaufen helfen kann. Gerne auch gegen kleine Aufwandsentschädigung. Standort: Horn-Bad Meinberg Zentrum.",
    category: "shopping",
    location: "Zentrum",
    author: "Maria Schmidt",
    urgent: true,
    type: "request"
  },
  {
    id: "2",
    title: "Gartenarbeit - Rasen mähen",
    description: "Suche Hilfe beim Rasenmähen für meinen ca. 200qm großen Garten. Rasenmäher ist vorhanden. Wäre super, wenn das alle 2 Wochen gemacht werden könnte. Standort: Silbergrund.",
    category: "garden",
    location: "Silbergrund",
    author: "Klaus Müller",
    urgent: false,
    type: "request"
  },
  {
    id: "3",
    title: "Biete Einkaufshilfe an",
    description: "Ich gehe regelmäßig einkaufen und kann gerne für ältere Menschen miteinkaufen. Ich habe ein Auto und Zeit am Vormittag.",
    category: "shopping",
    location: "Hauptstraße",
    author: "Anna Weber",
    urgent: false,
    type: "offer"
  },
  {
    id: "4",
    title: "Handwerkliche Hilfe - Kleinreparaturen",
    description: "Ich bin gelernter Schreiner und biete Hilfe bei kleineren Reparaturen im Haushalt an. Kostenlos für Senioren.",
    category: "garden",
    location: "Emmerstraße",
    author: "Thomas Klein",
    urgent: false,
    type: "offer"
  },
];

export default function NeighborhoodHelp() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"requests" | "offers" | "all">("requests");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  const filteredItems = MOCK_REQUESTS.filter(item => {
    // Filter by tab
    if (activeTab === "requests" && item.type !== "request") return false;
    if (activeTab === "offers" && item.type !== "offer") return false;
    
    // Filter by category
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    
    // Filter by urgent
    if (showUrgentOnly && !item.urgent) return false;
    
    return true;
  });

  const getCategoryEmoji = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId)?.emoji || "📌";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-4">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-8 max-w-5xl">
        {/* Info Box */}
        <Card className="mb-6 bg-green-50 border-green-200">
          <div className="p-4 flex items-start gap-3">
            <div className="bg-white rounded-full p-2">
              <HelpCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Wie funktioniert's?</h3>
              <p className="text-sm text-gray-700">
                Hier können Sie Hilfe anbieten oder Hilfe suchen. Ob Einkaufen, Handwerk, Kinderbetreuung oder Seniorenhilfe - gemeinsam sind wir stärker! 💪
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-orange-50 border-orange-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6 flex items-center gap-4">
              <div className="bg-orange-500 rounded-full p-4">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-900">Ich brauche Hilfe</h3>
                <p className="text-sm text-orange-700">Gesuch erstellen und Helfer finden</p>
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6 flex items-center gap-4">
              <div className="bg-green-500 rounded-full p-4">
                <HandHelping className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900">Ich möchte helfen</h3>
                <p className="text-sm text-green-700">Angebot erstellen und anderen helfen</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "requests" ? "default" : "outline"}
            onClick={() => setActiveTab("requests")}
            className={activeTab === "requests" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            Gesuche
          </Button>
          <Button
            variant={activeTab === "offers" ? "default" : "outline"}
            onClick={() => setActiveTab("offers")}
          >
            Angebote
          </Button>
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
          >
            Alle
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Alle Kategorien" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Checkbox 
                id="urgent" 
                checked={showUrgentOnly}
                onCheckedChange={(checked) => setShowUrgentOnly(checked as boolean)}
              />
              <label htmlFor="urgent" className="text-sm flex items-center gap-1 cursor-pointer">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Nur Dringend
              </label>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600">
                <List className="w-4 h-4 mr-1" />
                Liste
              </Button>
            </div>
          </div>
        </Card>

        {/* Items List */}
        <div className="space-y-4">
          {filteredItems.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {getCategoryEmoji(item.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        {item.urgent && (
                          <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                            Dringend
                          </span>
                        )}
                      </div>
                      <Button className="bg-green-500 hover:bg-green-600 text-white">
                        Anfragen
                      </Button>
                    </div>
                    <p className="text-gray-700 mb-3">{item.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{item.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500">Keine Einträge gefunden. Passen Sie die Filter an oder erstellen Sie einen neuen Eintrag.</p>
          </Card>
        )}

        {/* Demo Info */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            ℹ️ <strong>Demo-Modus:</strong> Dies ist eine Vorschau der Nachbarschaftshilfe-Funktion mit Beispieldaten. 
            Die vollständige Funktionalität mit Datenbank wird in Kürze verfügbar sein.
          </p>
        </Card>
      </div>
    </div>
  );
}
