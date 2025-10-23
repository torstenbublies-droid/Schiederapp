import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { mockBekanntmachungen } from "@/data/mockBekanntmachungen";

export default function News() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const announcements = mockBekanntmachungen;

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
          <p className="text-primary-foreground/90 mt-1">Bekanntmachungen aus Schieder-Schwalenberg</p>
        </div>
      </div>

      <div className="container py-8">
        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </Card>
            ))}
          </div>
        )}

        {/* Bekanntmachungen */}
        {!isLoading && (
          <>
            {announcements.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Aktuell keine Bekanntmachungen verfügbar.</p>
              </Card>
            )}

            {announcements.length > 0 && (
              <div className="grid gap-4">
                {announcements.map((item) => (
                  <Card key={item.id} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg h-fit">
                        <FileText size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <Calendar size={14} />
                          <span>{format(new Date(item.publishedAt), "dd. MMMM yyyy", { locale: de })}</span>
                        </div>

                        {item.teaser && (
                          <p className="text-muted-foreground mb-3">{item.teaser}</p>
                        )}

                        {item.sourceUrl && (
                          <Button asChild variant="link" className="px-0 mt-2">
                            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                              Mehr erfahren →
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

