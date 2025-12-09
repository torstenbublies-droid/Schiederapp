import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
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
    location: "Bürgersaal, Rathaus Domäne 3"
  },
  {
    id: 2,
    title: "Ablesung der Wasser- und Abwasserzähler im Stadtgebiet",
    date: "25.11.2025",
    category: "Bürger-Service",
    excerpt: "Ab dem 22. November werden die Wasser- und Abwasserzähler durch Bevollmächtigte der Stadt abgelesen.",
    content: "Die Stadt Schieder-Schwalenberg weist darauf hin, dass die Wasser- und Abwasserzähler im Stadtgebiet ab dem 22. November durch Bevollmächtigte der Stadt Schieder-Schwalenberg abgelesen werden. Die Bevollmächtigten können sich entsprechend ausweisen. Um die Verbrauchsabrechnung für das Jahr 2025 rechtzeitig erstellen zu können, müssen alle Zählerdaten bis zum 20. Dezember bei der Stadt eingegangen sein.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80"
  },
  {
    id: 3,
    title: "Schwalenberger ARTvent",
    date: "30.11.2025 - 28.12.2025",
    category: "Kultur & Veranstaltungen",
    excerpt: "Kunstausstellung im Advent im Werkhaus Schwalenberg mit Adventscafé des Kelter- und Kulturvereins.",
    content: "Kunstausstellung im Advent im Werkhaus Schwalenberg und am 28.12.2025 mit Adventscafé des Kelter- und Kulturvereins. Täglich von 15:00 bis 18:00 Uhr geöffnet.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    location: "Werkhaus Schwalenberg"
  },
  {
    id: 4,
    title: "Demokratie - Stimme der Freiheit",
    date: "07.12.2025 - 11.01.2026",
    category: "Kultur & Veranstaltungen",
    excerpt: "Zeitgenössische lippische Künstler*innen präsentieren ihre Werke zum Thema Demokratie und Freiheit.",
    content: "Zeitgenössische lippische Künstler*innen präsentieren ihre Werke zum Thema Demokratie und Freiheit. Die Ausstellung ist täglich von 15:00 bis 17:00 Uhr geöffnet.",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80",
    location: "Robert Koepke Haus"
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
          <h1 className="text-3xl font-bold">Aktuelles</h1>
          <p className="text-primary-foreground/90 mt-1">Neuigkeiten aus Schieder-Schwalenberg</p>
        </div>
      </div>

      <div className="container py-8">
        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
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
