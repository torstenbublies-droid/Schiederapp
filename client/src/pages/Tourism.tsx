import { ArrowLeft, ExternalLink, MapPin, Utensils, Hotel, Landmark, Users, Info } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Tourism() {
  const categories = [
    {
      title: "Erleben & Entdecken",
      description: "Natur erleben & bewegen - Wandern, Radfahren, Pilgern & Angeln. Sehenswürdigkeiten, Ausflugsziele, Attraktionen",
      icon: MapPin,
      color: "bg-green-500",
      links: [
        { name: "Wanderwege", url: "https://tourismus.schieder-schwalenberg.de/ERLEBEN-ENTDECKEN/Natur-erleben-bewegen/Wandern/" },
        { name: "Radfahren", url: "https://tourismus.schieder-schwalenberg.de/ERLEBEN-ENTDECKEN/Natur-erleben-bewegen/Radfahren/" },
        { name: "Sehenswürdigkeiten", url: "https://tourismus.schieder-schwalenberg.de/ERLEBEN-ENTDECKEN/Alles-erkunden-besuchen/Sehensw%C3%BCrdigkeiten/" },
        { name: "Ausflugsziele", url: "https://tourismus.schieder-schwalenberg.de/ERLEBEN-ENTDECKEN/Alles-erkunden-besuchen/Ausflugsziele/" },
      ]
    },
    {
      title: "Schlafen & Übernachten",
      description: "Hier finden Sie unsere Unterkünfte und Gastgeber - Hotels, Pensionen, Ferienwohnungen und mehr",
      icon: Hotel,
      color: "bg-blue-500",
      links: [
        { name: "Hotels & Pensionen", url: "https://tourismus.schieder-schwalenberg.de/SCHLAFEN-%C3%9CBERNACHTEN/Hotels-Pensionen/" },
        { name: "Ferienwohnungen", url: "https://tourismus.schieder-schwalenberg.de/SCHLAFEN-%C3%9CBERNACHTEN/Ferienwohnungen/" },
        { name: "Alle Unterkünfte", url: "https://tourismus.schieder-schwalenberg.de/SCHLAFEN-%C3%9CBERNACHTEN/" },
      ]
    },
    {
      title: "Schlemmen & Genießen",
      description: "Unsere Gastronomie ist einzigartig, regional und abwechslungsreich - Restaurants, Cafés und mehr",
      icon: Utensils,
      color: "bg-orange-500",
      links: [
        { name: "Restaurants", url: "https://tourismus.schieder-schwalenberg.de/SCHLEMMEN-GENIESSEN/Restaurants/" },
        { name: "Cafés & Bistros", url: "https://tourismus.schieder-schwalenberg.de/SCHLEMMEN-GENIESSEN/Caf%C3%A9s-Bistros/" },
        { name: "Alle Gastronomie", url: "https://tourismus.schieder-schwalenberg.de/SCHLEMMEN-GENIESSEN/" },
      ]
    },
    {
      title: "Kunst & Kultur",
      description: "Kunst und Kultur werden bei uns gelebt wie kaum woanders - Museen, Theater, Veranstaltungen",
      icon: Landmark,
      color: "bg-purple-500",
      links: [
        { name: "Museen", url: "https://tourismus.schieder-schwalenberg.de/ERLEBEN-ENTDECKEN/Alles-erkunden-besuchen/Museen/" },
        { name: "Kulturveranstaltungen", url: "https://tourismus.schieder-schwalenberg.de/ERLEBEN-ENTDECKEN/Alles-erkunden-besuchen/Kultur/" },
      ]
    },
    {
      title: "Gruppenangebote",
      description: "Unsere Gruppenangebote für Tagesausflüge - Wir beraten Sie gerne und erstellen individuelle Angebote",
      icon: Users,
      color: "bg-indigo-500",
      links: [
        { name: "Tagesausflüge", url: "https://tourismus.schieder-schwalenberg.de/GRUPPENANGEBOTE/" },
        { name: "Individuelle Angebote", url: "https://tourismus.schieder-schwalenberg.de/ANGEBOT-SERVICE/Kontakt/" },
      ]
    },
    {
      title: "Service & Informationen",
      description: "Von A-Z: Ärzte, Apotheken, Einkaufsmöglichkeiten und weitere nützliche Informationen",
      icon: Info,
      color: "bg-cyan-500",
      links: [
        { name: "Von A-Z", url: "https://tourismus.schieder-schwalenberg.de/VON-A-Z/" },
        { name: "Anreise & Verkehr", url: "https://tourismus.schieder-schwalenberg.de/ANGEBOT-SERVICE/Anreise-Verkehr/" },
        { name: "Prospekte & Downloads", url: "https://tourismus.schieder-schwalenberg.de/ANGEBOT-SERVICE/Prospekte-Downloads/" },
        { name: "Kontakt", url: "https://tourismus.schieder-schwalenberg.de/ANGEBOT-SERVICE/Kontakt/" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-teal-700 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Tourismus & Freizeit</h1>
          <p className="text-teal-100 mt-2">Entdecken Sie Schieder-Schwalenberg</p>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-teal-200 bg-gradient-to-br from-white to-teal-50">
          <CardHeader>
            <CardTitle className="text-2xl text-teal-800">Willkommen in Schieder-Schwalenberg</CardTitle>
            <CardDescription className="text-base italic text-gray-700">
              "Die Welt ist ein Buch. Wer nie reist, sieht nur eine Seite davon." – Augustinus Aurelius
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              365 Tage im Jahr – 7 Tage die Woche – 24 Stunden am Tag Natur entdecken, Momente erleben und genießen! 
              Unser malerisches und gastfreundliches Schieder-Schwalenberg und sein atemberaubendes Umland freuen sich 
              auf Ihren Besuch! Entdecken Sie Natur pur auf unseren zahlreichen Rund- und Fernwanderwegen, horchen Sie 
              in der Stille des Waldes mal wieder in sich selbst hinein, kommen Sie dem Märchen vom Wasser das bergauf 
              fließt auf die Spur, genießen Sie den Sonnenuntergang am See oder lassen Sie sich begeistern von den vielen 
              geschichtsträchtigen Bauten und Sehenswürdigkeiten unserer Region.
            </p>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-gray-200">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`${category.color} p-3 rounded-lg text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                      <CardDescription className="text-sm">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-gray-700 group-hover:text-teal-600 font-medium">
                          {link.name}
                        </span>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-teal-600" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <Card className="mt-8 bg-teal-50 border-teal-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-teal-800 mb-2">
                Weitere Informationen
              </h3>
              <p className="text-gray-700 mb-4">
                Besuchen Sie unsere offizielle Tourismus-Webseite für detaillierte Informationen, 
                Buchungsmöglichkeiten und aktuelle Veranstaltungen.
              </p>
              <a
                href="https://tourismus.schieder-schwalenberg.de"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Zur Tourismus-Webseite
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

