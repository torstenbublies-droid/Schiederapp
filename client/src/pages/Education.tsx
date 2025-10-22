import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function Education() {
  const { data: institutions, isLoading } = trpc.institutions.list.useQuery({});

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-purple-600 text-white py-6">
        <div className="container">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2 text-white hover:bg-white/20">
              <ArrowLeft size={16} className="mr-2" />
              Zurück
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Bildung & Familie</h1>
          <p className="text-white/90 mt-1">Kitas, Schulen und Betreuungsangebote</p>
        </div>
      </div>

      <div className="container py-8">
        {isLoading && <div className="text-center">Lädt...</div>}

        {!isLoading && institutions && institutions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Keine Informationen verfügbar.</p>
          </Card>
        )}

        {!isLoading && institutions && institutions.length > 0 && (
          <div className="grid gap-4">
            {institutions.map((inst) => (
              <Card key={inst.id} className="p-6">
                <h2 className="text-xl font-semibold mb-2">{inst.name}</h2>
                <p className="text-sm text-muted-foreground mb-3">{inst.type}</p>
                {inst.description && <p className="text-muted-foreground mb-3">{inst.description}</p>}
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  {inst.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <a href={`tel:${inst.phone}`} className="text-primary hover:underline">{inst.phone}</a>
                    </div>
                  )}
                  {inst.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      <a href={`mailto:${inst.email}`} className="text-primary hover:underline">{inst.email}</a>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
