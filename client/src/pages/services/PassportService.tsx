import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, CheckCircle2, AlertCircle, Calendar, FileText, Camera, Clock } from "lucide-react";
import { Link } from "wouter";

export default function PassportService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-red-600 text-white py-6">
        <div className="container">
          <Link href="/services">
            <Button variant="ghost" size="sm" className="mb-2 text-white hover:bg-white/20">
              <ArrowLeft size={16} className="mr-2" />
              Zurück zu Services
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <CreditCard size={32} />
            <h1 className="text-3xl font-bold">Pässe beantragen</h1>
          </div>
          <p className="text-white/90">Personalausweis und Reisepass online beantragen</p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Info Banner */}
        <Card className="p-6 bg-blue-50 border-blue-200 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Wichtiger Hinweis</h3>
              <p className="text-sm text-blue-800">
                Für die Beantragung eines Personalausweises oder Reisepasses ist ein persönlicher Termin 
                im Bürgeramt erforderlich. Dort werden Ihr biometrisches Foto und ggf. Ihre Fingerabdrücke erfasst.
              </p>
            </div>
          </div>
        </Card>

        {/* Document Types */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="text-blue-600" size={24} />
              Personalausweis
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <span>Gültig in Deutschland und EU-Ländern</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <span>Mit Online-Ausweisfunktion (eID)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <span>Gültigkeitsdauer: 10 Jahre (unter 24 Jahren: 6 Jahre)</span>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="font-semibold">Gebühr:</p>
                <p className="text-lg">37,00 € (unter 24 Jahren: 22,80 €)</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-red-600" size={24} />
              Reisepass
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <span>Weltweit gültig</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <span>32 oder 48 Seiten verfügbar</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <span>Gültigkeitsdauer: 10 Jahre (unter 24 Jahren: 6 Jahre)</span>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="font-semibold">Gebühr:</p>
                <p className="text-lg">70,00 € (unter 24 Jahren: 37,50 €)</p>
                <p className="text-xs text-muted-foreground mt-1">48 Seiten: +22,00 €</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Required Documents */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Benötigte Unterlagen</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="text-primary flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium">Aktueller Personalausweis oder Reisepass</p>
                <p className="text-sm text-muted-foreground">Falls vorhanden, bitte mitbringen</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Camera className="text-primary flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium">Biometrisches Foto</p>
                <p className="text-sm text-muted-foreground">Wird direkt im Bürgeramt aufgenommen</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="text-primary flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium">Bei Namensänderung: Heiratsurkunde oder Scheidungsurteil</p>
                <p className="text-sm text-muted-foreground">Falls zutreffend</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Process Timeline */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Ablauf</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">Termin vereinbaren</p>
                <p className="text-sm text-muted-foreground">Buchen Sie online einen Termin im Bürgeramt</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">Persönlich erscheinen</p>
                <p className="text-sm text-muted-foreground">Biometrisches Foto und ggf. Fingerabdrücke werden erfasst</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Bearbeitungszeit</p>
                <p className="text-sm text-muted-foreground">Ca. 4-6 Wochen (Express-Service gegen Aufpreis möglich)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <p className="font-medium">Abholung</p>
                <p className="text-sm text-muted-foreground">Sie werden benachrichtigt, wenn Ihr Dokument abholbereit ist</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Processing Time Info */}
        <Card className="p-6 mb-6 bg-amber-50 border-amber-200">
          <div className="flex gap-3">
            <Clock className="text-amber-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Bearbeitungszeiten</h3>
              <div className="text-sm text-amber-800 space-y-1">
                <p><strong>Standard:</strong> 4-6 Wochen</p>
                <p><strong>Express (gegen Aufpreis):</strong> 3-4 Werktage</p>
                <p className="text-xs mt-2">Bitte beantragen Sie Ihre Dokumente rechtzeitig vor Reisen!</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/service/termine" className="flex-1">
            <Button className="w-full" size="lg">
              <Calendar className="mr-2" size={20} />
              Termin vereinbaren
            </Button>
          </Link>
          <Link href="/contact" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              Fragen? Kontakt aufnehmen
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <Card className="mt-6 p-6 bg-muted/50">
          <h3 className="font-semibold mb-2">Weitere Informationen</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Detaillierte Informationen zu Personalausweis und Reisepass finden Sie auf der 
            offiziellen Website der Stadt Schieder-Schwalenberg.
          </p>
          <a 
            href="https://www.schieder-schwalenberg.de" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Zur Website →
          </a>
        </Card>
      </div>
    </div>
  );
}
