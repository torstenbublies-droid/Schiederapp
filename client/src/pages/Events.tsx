import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Euro } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function Events() {
  const { data: events, isLoading } = trpc.events.list.useQuery({ upcoming: true, limit: 50 });

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
          <h1 className="text-3xl font-bold">Veranstaltungen</h1>
          <p className="text-primary-foreground/90 mt-1">Kommende Events in Schieder-Schwalenberg</p>
        </div>
      </div>

      <div className="container py-8">
        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </Card>
            ))}
          </div>
        )}

        {!isLoading && events && events.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Aktuell keine Veranstaltungen geplant.</p>
          </Card>
        )}

        {!isLoading && events && events.length > 0 && (
          <div className="grid gap-4">
            {events.map((event) => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex gap-4">
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                    {event.description && (
                      <p className="text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {format(new Date(event.startDate), "dd. MMMM yyyy, HH:mm", { locale: de })} Uhr
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.cost && (
                        <div className="flex items-center gap-1">
                          <Euro size={14} />
                          <span>{event.cost}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

