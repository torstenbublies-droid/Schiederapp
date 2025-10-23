import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function ServiceTermine() {
  const handleBooking = () => {
    // Placeholder URL - will be replaced with actual booking system
    const bookingUrl = "https://termine.schieder-schwalenberg.de"; // PLACEHOLDER
    window.open(bookingUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-blue-600 text-white py-8">
        <div className="container">
          <Link href="/services">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zu Services
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Calendar size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Termin Rathaus</h1>
              <p className="text-white/90 mt-1">Online-Terminbuchung</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Termin buchen</h2>
              <p className="text-muted-foreground text-lg">
                Buche deinen Termin im Rathaus Schieder-Schwalenberg in wenigen Schritten. 
                Du erhältst eine Bestätigung per E-Mail.
              </p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Verfügbare Termine für:</h3>
              <ul className="space-y-2 text-sm">
                <li>• Personalausweis & Reisepass</li>
                <li>• An- und Ummeldungen</li>
                <li>• Führungszeugnis</li>
                <li>• Beglaubigungen</li>
                <li>• Allgemeine Anliegen</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                Hinweis
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Das Online-Terminbuchungssystem wird derzeit eingerichtet. 
                Bitte rufen Sie uns in der Zwischenzeit unter 05282 / 601-0 an, 
                um einen Termin zu vereinbaren.
              </p>
            </div>

            <Button 
              onClick={handleBooking}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Jetzt Termin buchen
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>

            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">Kontakt</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Bürgerbüro</strong></p>
                <p>Telefon: 05282 / 601-0</p>
                <p>E-Mail: buergerbuero@schieder-schwalenberg.de</p>
                <p>Öffnungszeiten: Mo-Fr: 8:00-12:00 Uhr, Do: 14:00-18:00 Uhr</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

