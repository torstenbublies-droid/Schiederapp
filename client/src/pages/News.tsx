import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, FileText, Users, Building, Baby, Vote, Droplets, Construction, TreePine } from "lucide-react";
import { Link } from "wouter";

interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  image?: string;
  location?: string;
  icon?: React.ReactNode;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Bürgerversammlung zur Vorstellung des Starkregenhandlungskonzeptes",
    date: "25.11.2025",
    category: "Rathaus & Politik",
    excerpt: "Infolge des Klimawandels hat die Anzahl von Starkregenereignissen zugenommen. Die Stadt lädt zur Informationsveranstaltung ein.",
    content: "Infolge des Klimawandels in den vergangenen Jahren hat die Anzahl von Starkregenereignissen nicht nur zugenommen. Starkregen tritt, teils mit hohen Schäden, auch in stärkerem Ausmaß auf als bisher. Die Stadt hat aus diesem Grund im Jahr 2023 die Aufstellung eines örtlichen Starkregenkonzeptes beschlossen. Die Veranstaltung findet am Mittwoch, den 17. Dezember, um 18:00 Uhr im Bürgersaal, Rathaus Domäne 3, 1.OG im Ortsteil Schieder statt.",
    image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80",
    location: "Bürgersaal, Rathaus Domäne 3",
    icon: <Droplets className="text-blue-600" size={20} />
  },
  {
    id: 2,
    title: "Ablesung der Wasser- und Abwasserzähler im Stadtgebiet",
    date: "25.11.2025",
    category: "Bürger-Service",
    excerpt: "Ab dem 22. November werden die Wasser- und Abwasserzähler durch Bevollmächtigte der Stadt abgelesen.",
    content: "Die Stadt Schieder-Schwalenberg weist darauf hin, dass die Wasser- und Abwasserzähler im Stadtgebiet ab dem 22. November durch Bevollmächtigte der Stadt Schieder-Schwalenberg abgelesen werden. Die Bevollmächtigten können sich entsprechend ausweisen. Um die Verbrauchsabrechnung für das Jahr 2025 rechtzeitig erstellen zu können, müssen alle Zählerdaten bis zum 20. Dezember bei der Stadt eingegangen sein.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    icon: <Droplets className="text-cyan-600" size={20} />
  },
  {
    id: 3,
    title: "Verkehrseinschränkungen in Glashütte",
    date: "18.11.2025",
    category: "Verkehr & Bauen",
    excerpt: "Verkehrseinschränkungen in Glashütte ab 18.11.2025 aufgrund von Bauarbeiten.",
    content: "Aufgrund von Bauarbeiten kommt es ab dem 18. November 2025 zu Verkehrseinschränkungen im Ortsteil Glashütte. Bitte beachten Sie die Beschilderung vor Ort und planen Sie ggf. mehr Zeit für Ihre Fahrt ein.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    icon: <Construction className="text-orange-600" size={20} />
  },
  {
    id: 4,
    title: "1. Änderung der Satzung des Zweckverbandes Ostwestfalen-Lippe-IT",
    date: "18.11.2025",
    category: "Rathaus & Politik",
    excerpt: "Änderung der Satzung des Zweckverbandes Ostwestfalen-Lippe-IT wurde beschlossen.",
    content: "Die 1. Änderung der Satzung des Zweckverbandes Ostwestfalen-Lippe-IT wurde vom Rat beschlossen und tritt mit sofortiger Wirkung in Kraft.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    icon: <FileText className="text-indigo-600" size={20} />
  },
  {
    id: 5,
    title: "Anmeldeverfahren für das Kindergartenjahr 2026/2027",
    date: "29.10.2025",
    category: "Familie & Soziales",
    excerpt: "Das Anmeldeverfahren für das Kindergartenjahr 2026/2027 hat begonnen.",
    content: "Eltern können ihre Kinder ab sofort für das Kindergartenjahr 2026/2027 anmelden. Die Anmeldung erfolgt über das zentrale Online-Portal der Stadt. Weitere Informationen erhalten Sie im Familienbüro.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
    icon: <Baby className="text-pink-600" size={20} />
  },
  {
    id: 6,
    title: "Inkrafttreten des Bebauungsplanes 01/31 „Südufer SchiederSee II"",
    date: "22.10.2025",
    category: "Bauen & Stadtplanung",
    excerpt: "Der Bebauungsplan 01/31 „Südufer SchiederSee II" ist in Kraft getreten.",
    content: "Der Bebauungsplan 01/31 „Südufer SchiederSee II" der Stadt Schieder-Schwalenberg gemäß § 10 Abs. 1 Baugesetzbuch (BauGB) vom 22.10.2025 ist in Kraft getreten. Der Plan kann im Rathaus eingesehen werden.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    location: "Südufer SchiederSee",
    icon: <Building className="text-blue-600" size={20} />
  },
  {
    id: 7,
    title: "Datenübermittlungen durch die Meldebehörde",
    date: "22.10.2025",
    category: "Bürger-Service",
    excerpt: "Information über zulässige Datenübermittlungen gemäß Bundesmeldegesetz.",
    content: "Gemäß § 42 und § 50 des Bundesmeldegesetzes (BMG) und gemäß § 58c des Soldatengesetzes (SG) sind folgende Datenübermittlungen durch die Stadt Schieder-Schwalenberg als Meldebehörde zulässig. Weitere Details finden Sie in der vollständigen Bekanntmachung.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    icon: <FileText className="text-gray-600" size={20} />
  },
  {
    id: 8,
    title: "Ergebnis der Stichwahl des Bürgermeisters",
    date: "29.09.2025",
    category: "Rathaus & Politik",
    excerpt: "Das offizielle Ergebnis der Bürgermeister-Stichwahl wurde bekanntgegeben.",
    content: "Nachdem der Wahlausschuss das Ergebnis der Stichwahl des Bürgermeisters festgestellt hat, wird dieses gemäß § 35 und 46b des Kommunalwahlgesetzes (KWahlG) i.V.m. § 63 und 75a der Kommunalwahlordnung (KWahlO) hiermit bekanntgegeben.",
    image: "https://images.unsplash.com/photo-1495316364083-b5bf2b2ad0d2?w=800&q=80",
    icon: <Vote className="text-red-600" size={20} />
  },
  {
    id: 9,
    title: "Wahlergebnisse zur Stichwahl",
    date: "29.09.2025",
    category: "Rathaus & Politik",
    excerpt: "Die detaillierten Wahlergebnisse zur Stichwahl sind nun verfügbar.",
    content: "Die Wahlergebnisse zur Stichwahl in Schieder-Schwalenberg können Sie hier einsehen. Am 28. September um 18 Uhr schlossen die Wahllokale, anschließend erfolgte die Auszählung.",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80",
    icon: <Vote className="text-purple-600" size={20} />
  },
  {
    id: 10,
    title: "Stichwahl zur Wahl des Landrates und des Bürgermeisters",
    date: "18.09.2025",
    category: "Rathaus & Politik",
    excerpt: "Information zur Stichwahl am 28. September 2025 mit Briefwahl-Möglichkeit.",
    content: "Am 28. September 2025 findet die Stichwahl zur Wahl des Landrates und des Bürgermeisters statt. Sie können Ihre Stimme auch per Briefwahl abgeben. Briefwahlunterlagen können im Rathaus beantragt werden.",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    icon: <Vote className="text-blue-600" size={20} />
  }
];

export default function News() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (selectedNews) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary text-primary-foreground py-6">
          <div className="container">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setSelectedNews(null)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Zurück zu Aktuelles
            </Button>
            <h1 className="text-3xl font-bold">{selectedNews.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-primary-foreground/90">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {selectedNews.date}
              </span>
              <span className="px-2 py-1 bg-primary-foreground/20 rounded-full text-xs">
                {selectedNews.category}
              </span>
            </div>
          </div>
        </div>

        <div className="container py-8 max-w-4xl">
          {selectedNews.image && (
            <img 
              src={selectedNews.image} 
              alt={selectedNews.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          {selectedNews.location && (
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin size={16} />
              <span>{selectedNews.location}</span>
            </div>
          )}

          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed">{selectedNews.content}</p>
          </div>

          <div className="mt-8">
            <Link href="/contact">
              <Button>
                Weitere Informationen anfragen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2 text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft size={16} className="mr-2" />
              Zurück
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Aktuelles & Bekanntmachungen</h1>
          <p className="text-primary-foreground/90 mt-1">Neuigkeiten und offizielle Mitteilungen aus Schieder-Schwalenberg</p>
        </div>
      </div>

      <div className="container py-8">
        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="grid gap-6">
            {newsData.map((news) => (
              <Card 
                key={news.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedNews(news)}
              >
                <div className="md:flex">
                  {news.image && (
                    <div className="md:w-1/3">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-center gap-2 mb-2">
                      {news.icon}
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {news.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={12} />
                        {news.date}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                      {news.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-3">
                      {news.excerpt}
                    </p>
                    {news.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        <span>{news.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 p-6 bg-muted/50">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Users size={20} />
            Weitere Informationen
          </h3>
          <p className="text-sm text-muted-foreground">
            Aktuelle Bekanntmachungen und weitere Neuigkeiten finden Sie auch auf der 
            offiziellen Website der Stadt Schieder-Schwalenberg.
          </p>
          <a 
            href="https://www.schieder-schwalenberg.de" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline mt-2 inline-block"
          >
            Zur Website →
          </a>
        </Card>
      </div>
    </div>
  );
}
