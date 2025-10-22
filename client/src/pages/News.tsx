import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag, FileText } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useState } from "react";

export default function News() {
  const [activeTab, setActiveTab] = useState<"news" | "announcements">("news");
  const { data: allNews, isLoading } = trpc.news.list.useQuery({ limit: 50 });

  const newsList = allNews?.filter(item => item.category !== "Bekanntmachung") || [];
  const announcements = allNews?.filter(item => item.category === "Bekanntmachung") || [];

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
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("news")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "news"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Neuigkeiten
            {activeTab === "news" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "announcements"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Bekanntmachungen
            {activeTab === "announcements" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

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

        {/* Neuigkeiten Tab */}
        {!isLoading && activeTab === "news" && (
          <>
            {newsList.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Aktuell keine Nachrichten verfügbar.</p>
              </Card>
            )}

            {newsList.length > 0 && (
              <div className="grid gap-4">
                {newsList.map((item) => (
                  <Card key={item.id} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex gap-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{format(new Date(item.publishedAt), "dd. MMMM yyyy", { locale: de })}</span>
                          </div>
                          {item.category && (
                            <div className="flex items-center gap-1">
                              <Tag size={14} />
                              <span>{item.category}</span>
                            </div>
                          )}
                        </div>

                        {item.teaser && (
                          <p className="text-muted-foreground mb-3">{item.teaser}</p>
                        )}

                        {item.bodyMD && (
                          <p className="text-muted-foreground line-clamp-3">{item.bodyMD}</p>
                        )}

                        {item.sourceUrl && (
                          <Button asChild variant="link" className="px-0 mt-2">
                            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                              Weiterlesen →
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

        {/* Bekanntmachungen Tab */}
        {!isLoading && activeTab === "announcements" && (
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

                        {item.bodyMD && (
                          <p className="text-muted-foreground">{item.bodyMD}</p>
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

