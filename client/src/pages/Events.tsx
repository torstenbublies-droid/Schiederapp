import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "wouter";

// Hardcoded events from https://www.schieder-schwalenberg.de/Tourismus/Tourismus-und-Freizeit/Service/Veranstaltungskalender/
const EVENTS = [
  {
    id: "1",
    title: "Schwalenberger ARTvent",
    description: "Jeden Adventssonntag im Werkhaus Schwalenberg und am 28.12.2025 mit Adventscafe des Kelter- und Kulturvereins",
    startDate: "30.11.2025",
    endDate: "28.12.2025",
    time: "15:00 - 18:00 Uhr",
    location: "Werkhaus Schwalenberg",
    imageUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400"
  },
  {
    id: "2",
    title: "Demokratie- Stimme der Freiheit",
    description: "Zeitgenössische lippische Künstler*innen",
    startDate: "07.12.2025",
    endDate: "11.01.2026",
    time: "15:00 - 17:00 Uhr",
    location: "Robert Koepke Haus",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400"
  },
  {
    id: "3",
    title: "Schwalenberger ARTvent",
    description: "Jeden Adventssonntag im Werkhaus Schwalenberg und am 28.12.2025 mit Adventscafe des Kelter- und Kulturvereins",
    startDate: "07.12.2025",
    endDate: "04.01.2026",
    time: "15:00 - 18:00 Uhr",
    location: "Werkhaus Schwalenberg",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400"
  },
  {
    id: "4",
    title: "Schwalenberger ARTvent",
    description: "Jeden Adventssonntag im Werkhaus Schwalenberg und am 28.12.2025 mit Adventscafe des Kelter- und Kulturvereins",
    startDate: "14.12.2025",
    endDate: "11.01.2026",
    time: "15:00 - 18:00 Uhr",
    location: "Werkhaus Schwalenberg",
    imageUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400"
  },
  {
    id: "5",
    title: "Schwalenberger ARTvent",
    description: "Jeden Adventssonntag im Werkhaus Schwalenberg und am 28.12.2025 mit Adventscafe des Kelter- und Kulturvereins",
    startDate: "21.12.2025",
    endDate: "18.01.2026",
    time: "15:00 - 18:00 Uhr",
    location: "Werkhaus Schwalenberg",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"
  },
  {
    id: "6",
    title: "Schwalenberger ARTvent",
    description: "Jeden Adventssonntag im Werkhaus Schwalenberg und am 28.12.2025 mit Adventscafe des Kelter- und Kulturvereins",
    startDate: "28.12.2025",
    endDate: "25.01.2026",
    time: "15:00 - 18:00 Uhr",
    location: "Werkhaus Schwalenberg",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400"
  }
];

export default function Events() {
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
        <div className="grid gap-4">
          {EVENTS.map((event) => (
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
                    <p className="text-muted-foreground mb-3">{event.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>
                        {event.startDate} {event.endDate && `- ${event.endDate}`}
                      </span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
