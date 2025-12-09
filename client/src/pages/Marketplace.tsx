import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, HelpCircle, ShoppingBag, Search, MapPin, User, 
  Euro, Filter, List, MessageCircle, X
} from "lucide-react";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock-Daten
const CATEGORIES = [
  { id: "all", name: "Alle Kategorien" },
  { id: "furniture", name: "Möbel" },
  { id: "electronics", name: "Elektronik" },
  { id: "garden", name: "Garten" },
  { id: "clothing", name: "Kleidung" },
  { id: "toys", name: "Spielzeug" },
  { id: "books", name: "Bücher" },
  { id: "sports", name: "Sport" },
  { id: "other", name: "Sonstiges" },
];

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Fahrrad 26 Zoll - gut erhalten",
    description: "Verkaufe mein gut erhaltenes Damenfahrrad, 26 Zoll, 7-Gang Shimano. Wurde regelmäßig gewartet. Keine Mängel.",
    price: "80",
    category: "sports",
    location: "Schieder",
    author: "Anna Schmidt",
    type: "offer",
    images: ["https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400"]
  },
  {
    id: "2",
    title: "Kinderbett mit Matratze",
    description: "Weißes Kinderbett (70x140cm) inkl. Matratze zu verkaufen. Sehr guter Zustand, keine Beschädigungen. Wurde nur 2 Jahre genutzt.",
    price: "120",
    category: "furniture",
    location: "Schwalenberg",
    author: "Familie Müller",
    type: "offer",
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400"]
  },
  {
    id: "3",
    title: "Gartenmöbel Set - 4 Stühle + Tisch",
    description: "Verkaufe Gartenmöbel-Set aus Holz. 1 Tisch (120x80cm) und 4 Stühle. Wetterfest behandelt. Abholung in Lothe.",
    price: "150",
    category: "garden",
    location: "Lothe",
    author: "Klaus Weber",
    type: "offer",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400"]
  },
  {
    id: "4",
    title: "Suche: Rasenmäher (benzinbetrieben)",
    description: "Ich suche einen gebrauchten Benzin-Rasenmäher für meinen Garten (ca. 300qm). Sollte noch gut funktionieren. Zahle bis zu 100€.",
    price: "100",
    category: "garden",
    location: "Brakelsiek",
    author: "Thomas Klein",
    type: "search",
    images: []
  },
  {
    id: "5",
    title: "Suche: Kinderwagen",
    description: "Wir erwarten unser erstes Kind und suchen einen gut erhaltenen Kinderwagen. Gerne mit Zubehör. Budget bis 200€.",
    price: "200",
    category: "toys",
    location: "Schieder",
    author: "Lisa und Mark",
    type: "search",
    images: []
  },
];

export default function Marketplace() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"offers" | "searches" | "all">("offers");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<typeof MOCK_LISTINGS[0] | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  const filteredItems = MOCK_LISTINGS.filter(item => {
    // Filter by tab
    if (activeTab === "offers" && item.type !== "offer") return false;
    if (activeTab === "searches" && item.type !== "search") return false;
    
    // Filter by category
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    
    return true;
  });

  const handleContact = (listing: typeof MOCK_LISTINGS[0]) => {
    setSelectedListing(listing);
    setChatOpen(true);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      alert(`Nachricht an ${selectedListing?.author} gesendet: "${chatMessage}"`);
      setChatMessage("");
      setChatOpen(false);
    }
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
                Hier können Sie Waren anbieten oder suchen - wie bei Kleinanzeigen! Verkaufen, verschenken oder tauschen Sie Dinge, die Sie nicht mehr brauchen. 🛍️
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-orange-50 border-orange-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6 flex items-center gap-4">
              <div className="bg-orange-500 rounded-full p-4">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-900">Ich biete etwas an</h3>
                <p className="text-sm text-orange-700">Anzeige erstellen und verkaufen</p>
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6 flex items-center gap-4">
              <div className="bg-green-500 rounded-full p-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900">Ich suche etwas</h3>
                <p className="text-sm text-green-700">Gesuch erstellen und finden</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "offers" ? "default" : "outline"}
            onClick={() => setActiveTab("offers")}
            className={activeTab === "offers" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            Angebote
          </Button>
          <Button
            variant={activeTab === "searches" ? "default" : "outline"}
            onClick={() => setActiveTab("searches")}
            className={activeTab === "searches" ? "bg-green-500 hover:bg-green-600" : ""}
          >
            Gesuche
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
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="default" size="sm" className="bg-blue-500 hover:bg-blue-600">
                <List className="w-4 h-4 mr-1" />
                Liste
              </Button>
            </div>
          </div>
        </Card>

        {/* Listings */}
        <div className="space-y-4">
          {filteredItems.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image */}
                  {item.images.length > 0 && (
                    <div className="w-full md:w-48 h-48 flex-shrink-0">
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            item.type === "offer" 
                              ? "bg-orange-100 text-orange-700" 
                              : "bg-green-100 text-green-700"
                          }`}>
                            {item.type === "offer" ? "Angebot" : "Gesuch"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-bold text-xl mb-2">
                          <Euro className="w-5 h-5" />
                          <span>{item.price}</span>
                        </div>
                      </div>
                      <Button 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleContact(item)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Kontakt
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
            <p className="text-gray-500">Keine Anzeigen gefunden. Passen Sie die Filter an oder erstellen Sie eine neue Anzeige.</p>
          </Card>
        )}

        {/* Demo Info */}
        <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            ℹ️ <strong>Demo-Modus:</strong> Dies ist eine Vorschau des Marktplatzes mit Beispieldaten. 
            Die vollständige Funktionalität mit Bild-Upload und echter Chat-Funktion wird in Kürze verfügbar sein.
          </p>
        </Card>
      </div>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kontakt aufnehmen</DialogTitle>
            <DialogDescription>
              Senden Sie eine Nachricht an {selectedListing?.author} bezüglich "{selectedListing?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Ihre Nachricht..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setChatOpen(false)}>
                Abbrechen
              </Button>
              <Button 
                className="bg-green-500 hover:bg-green-600"
                onClick={handleSendMessage}
                disabled={!chatMessage.trim()}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Nachricht senden
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
