import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, ExternalLink, X, Download, Clock, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

interface ServiceDetail {
  title: string;
  description: string;
  details: string;
  requirements: string[];
  process: string[];
  contact?: {
    office?: string;
    phone?: string;
    email?: string;
    hours?: string;
  };
  downloadUrl?: string;
}

const servicesData: ServiceDetail[] = [
  {
    title: "Personalausweis beantragen",
    description: "Informationen zur Beantragung eines neuen Personalausweises",
    details: "Der Personalausweis ist das wichtigste Ausweisdokument in Deutschland. Er wird für 10 Jahre (ab 24 Jahren) bzw. 6 Jahre (unter 24 Jahren) ausgestellt.",
    requirements: [
      "Aktuelles biometrisches Passfoto",
      "Alter Personalausweis (falls vorhanden)",
      "Geburtsurkunde (bei Erstausstellung)",
      "Bei Minderjährigen: Zustimmung beider Elternteile"
    ],
    process: [
      "Termin im Bürgerbüro vereinbaren",
      "Persönlich mit allen Unterlagen erscheinen",
      "Antrag ausfüllen und unterschreiben",
      "Gebühr bezahlen (ca. 37 €)",
      "Nach ca. 3-4 Wochen Abholung"
    ],
    contact: {
      office: "Bürgerbüro",
      phone: "05282 / 601-0",
      email: "buergerbuero@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr, Do: 14:00-18:00 Uhr"
    }
  },
  {
    title: "Reisepass beantragen",
    description: "Anleitung zur Beantragung eines Reisepasses",
    details: "Der Reisepass wird für Reisen außerhalb der EU benötigt. Er ist 10 Jahre (ab 24 Jahren) bzw. 6 Jahre (unter 24 Jahren) gültig.",
    requirements: [
      "Aktuelles biometrisches Passfoto",
      "Personalausweis oder alter Reisepass",
      "Geburtsurkunde (bei Erstausstellung)",
      "Bei Minderjährigen: Zustimmung beider Elternteile"
    ],
    process: [
      "Termin im Bürgerbüro vereinbaren",
      "Persönlich erscheinen (Fingerabdrücke werden genommen)",
      "Antrag ausfüllen und unterschreiben",
      "Gebühr bezahlen (ca. 60 €, Express: 92 €)",
      "Nach ca. 3-4 Wochen Abholung (Express: 3-4 Werktage)"
    ],
    contact: {
      office: "Bürgerbüro",
      phone: "05282 / 601-0",
      email: "buergerbuero@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr, Do: 14:00-18:00 Uhr"
    }
  },
  {
    title: "An- und Ummeldung",
    description: "Wohnsitz an- oder ummelden",
    details: "Bei einem Umzug müssen Sie sich innerhalb von 2 Wochen bei der Meldebehörde an- oder ummelden.",
    requirements: [
      "Personalausweis oder Reisepass",
      "Wohnungsgeberbestätigung (vom Vermieter)",
      "Bei Familien: Ausweise aller Familienmitglieder",
      "Heiratsurkunde (bei Verheirateten)"
    ],
    process: [
      "Termin im Bürgerbüro vereinbaren (oder ohne Termin)",
      "Anmeldeformular ausfüllen",
      "Wohnungsgeberbestätigung vorlegen",
      "Meldebescheinigung erhalten",
      "Adresse im Personalausweis wird aktualisiert"
    ],
    contact: {
      office: "Bürgerbüro",
      phone: "05282 / 601-0",
      email: "buergerbuero@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr, Do: 14:00-18:00 Uhr"
    }
  },
  {
    title: "Führungszeugnis",
    description: "Beantragung eines Führungszeugnisses",
    details: "Das Führungszeugnis gibt Auskunft über im Bundeszentralregister gespeicherte Verurteilungen. Es wird häufig für Bewerbungen oder ehrenamtliche Tätigkeiten benötigt.",
    requirements: [
      "Personalausweis oder Reisepass",
      "Verwendungszweck angeben",
      "Gebühr: 13 € (bar oder EC-Karte)"
    ],
    process: [
      "Persönlich im Bürgerbüro erscheinen",
      "Antrag ausfüllen",
      "Gebühr bezahlen",
      "Führungszeugnis wird direkt an Ihre Wohnadresse geschickt",
      "Zustellung erfolgt nach ca. 2 Wochen"
    ],
    contact: {
      office: "Bürgerbüro",
      phone: "05282 / 601-0",
      email: "buergerbuero@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr, Do: 14:00-18:00 Uhr"
    }
  },
  {
    title: "Geburtsurkunde beantragen",
    description: "Beantragung einer Geburtsurkunde",
    details: "Geburtsurkunden werden für verschiedene Zwecke benötigt, z.B. für Eheschließung, Rentenantrag oder Erbschaftsangelegenheiten.",
    requirements: [
      "Personalausweis oder Reisepass",
      "Name und Geburtsdatum der Person",
      "Geburtsort (falls nicht in Schieder-Schwalenberg geboren, beim zuständigen Standesamt beantragen)"
    ],
    process: [
      "Antrag beim Standesamt stellen",
      "Gebühr bezahlen (12 € pro Urkunde)",
      "Urkunde wird ausgestellt",
      "Abholung oder Zusendung per Post möglich"
    ],
    contact: {
      office: "Standesamt",
      phone: "05282 / 601-0",
      email: "standesamt@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr"
    }
  },
  {
    title: "Heiratsurkunde beantragen",
    description: "Beantragung einer Heiratsurkunde",
    details: "Heiratsurkunden dokumentieren die Eheschließung und werden für verschiedene rechtliche Vorgänge benötigt.",
    requirements: [
      "Personalausweis oder Reisepass",
      "Name der Ehepartner",
      "Datum und Ort der Eheschließung"
    ],
    process: [
      "Antrag beim Standesamt stellen",
      "Gebühr bezahlen (12 € pro Urkunde)",
      "Urkunde wird ausgestellt",
      "Abholung oder Zusendung per Post"
    ],
    contact: {
      office: "Standesamt",
      phone: "05282 / 601-0",
      email: "standesamt@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr"
    }
  },
  {
    title: "Kfz-Zulassung",
    description: "Fahrzeug an- oder ummelden",
    details: "Für die Zulassung eines Fahrzeugs ist die Kfz-Zulassungsstelle des Kreises Lippe zuständig.",
    requirements: [
      "Personalausweis oder Reisepass",
      "Fahrzeugschein und Fahrzeugbrief",
      "eVB-Nummer (elektronische Versicherungsbestätigung)",
      "HU/AU-Bescheinigung (nicht älter als 2 Monate)",
      "Bei Gebrauchtwagen: Kaufvertrag"
    ],
    process: [
      "Termin bei der Kfz-Zulassungsstelle vereinbaren",
      "Alle Unterlagen mitbringen",
      "Gebühren bezahlen (ca. 26-30 €)",
      "Kennzeichen prägen lassen",
      "Fahrzeug ist zugelassen"
    ],
    contact: {
      office: "Kfz-Zulassungsstelle Kreis Lippe",
      phone: "05231 / 62-0",
      email: "kfz@kreis-lippe.de",
      hours: "Mo-Fr: 7:30-12:00 Uhr, Do: 14:00-17:30 Uhr"
    }
  },
  {
    title: "Wohngeld beantragen",
    description: "Antrag auf Wohngeld (Mietzuschuss)",
    details: "Wohngeld ist ein Zuschuss zur Miete oder Belastung für selbstgenutztes Wohneigentum für Haushalte mit geringem Einkommen.",
    requirements: [
      "Personalausweis",
      "Mietvertrag und Mietbescheinigung",
      "Einkommensnachweise aller Haushaltsmitglieder",
      "Nachweise über Heizkosten",
      "Bei Eigentum: Nachweise über Belastungen"
    ],
    process: [
      "Antragsformular ausfüllen",
      "Alle Nachweise beifügen",
      "Antrag bei der Wohngeldstelle einreichen",
      "Bearbeitungszeit ca. 4-8 Wochen",
      "Bescheid wird zugesandt"
    ],
    contact: {
      office: "Wohngeldstelle",
      phone: "05282 / 601-0",
      email: "wohngeld@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr, Do: 14:00-16:00 Uhr"
    }
  },
  {
    title: "Gewerbeanmeldung",
    description: "Anmeldung eines Gewerbes",
    details: "Jeder, der ein Gewerbe betreiben möchte, muss dies beim Gewerbeamt anmelden.",
    requirements: [
      "Personalausweis oder Reisepass",
      "Bei ausländischen Staatsangehörigen: Aufenthaltstitel",
      "Bei bestimmten Gewerben: Erlaubnisse/Nachweise (z.B. Handwerkskarte)"
    ],
    process: [
      "Gewerbeanmeldung ausfüllen",
      "Persönlich beim Gewerbeamt erscheinen",
      "Gebühr bezahlen (ca. 20-40 €)",
      "Gewerbeschein wird ausgestellt",
      "Information geht automatisch an Finanzamt, IHK/HWK"
    ],
    contact: {
      office: "Gewerbeamt",
      phone: "05282 / 601-0",
      email: "gewerbe@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr"
    }
  },
  {
    title: "Gewerbeabmeldung",
    description: "Abmeldung eines Gewerbes",
    details: "Bei Aufgabe oder Verlegung eines Gewerbes muss dies dem Gewerbeamt mitgeteilt werden.",
    requirements: [
      "Personalausweis oder Reisepass",
      "Gewerbeschein (falls vorhanden)",
      "Datum der Gewerbeaufgabe"
    ],
    process: [
      "Gewerbeabmeldung ausfüllen",
      "Persönlich oder schriftlich beim Gewerbeamt einreichen",
      "Gebühr bezahlen (ca. 20 €)",
      "Bestätigung erhalten",
      "Information geht an Finanzamt, IHK/HWK"
    ],
    contact: {
      office: "Gewerbeamt",
      phone: "05282 / 601-0",
      email: "gewerbe@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr"
    }
  },
  {
    title: "Bauantrag stellen",
    description: "Antrag für Bauvorhaben",
    details: "Für Neubauten, Umbauten und größere Renovierungen ist in der Regel eine Baugenehmigung erforderlich.",
    requirements: [
      "Bauvorlagen (Bauzeichnungen, Lageplan, Baubeschreibung)",
      "Nachweis der Bauvorlageberechtigung (Architekt/Ingenieur)",
      "Katasterauszug",
      "Berechnungen (Wohnfläche, umbauter Raum)",
      "Bei Bedarf: Statische Berechnungen"
    ],
    process: [
      "Bauvorlagen durch Architekten erstellen lassen",
      "Bauantrag beim Bauamt einreichen",
      "Prüfung durch Bauamt (ca. 2-3 Monate)",
      "Baugenehmigung oder Ablehnung",
      "Bei Genehmigung: Baubeginn möglich"
    ],
    contact: {
      office: "Bauamt",
      phone: "05282 / 601-0",
      email: "bauamt@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr, Do: 14:00-16:00 Uhr"
    }
  },
  {
    title: "Kinderreisepass beantragen",
    description: "Reisepass für Kinder unter 12 Jahren",
    details: "Der Kinderreisepass ist für Kinder unter 12 Jahren gedacht und wird sofort ausgestellt.",
    requirements: [
      "Biometrisches Passfoto des Kindes",
      "Geburtsurkunde des Kindes",
      "Personalausweise beider Elternteile",
      "Beide Elternteile müssen zustimmen (persönlich erscheinen oder Vollmacht)"
    ],
    process: [
      "Termin im Bürgerbüro vereinbaren",
      "Mit Kind und beiden Elternteilen erscheinen",
      "Antrag ausfüllen",
      "Gebühr bezahlen (13 €)",
      "Kinderreisepass wird sofort ausgestellt"
    ],
    contact: {
      office: "Bürgerbüro",
      phone: "05282 / 601-0",
      email: "buergerbuero@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr, Do: 14:00-18:00 Uhr"
    }
  },
  {
    title: "Parkausweis für Schwerbehinderte",
    description: "Beantragung eines Behindertenparkausweises",
    details: "Schwerbehinderte Menschen mit bestimmten Merkzeichen können einen Parkausweis beantragen, der das Parken auf Behindertenparkplätzen erlaubt.",
    requirements: [
      "Schwerbehindertenausweis mit Merkzeichen aG, Bl oder H",
      "Personalausweis",
      "Passfoto",
      "Bei Merkzeichen aG: Ärztliches Gutachten"
    ],
    process: [
      "Antrag beim Straßenverkehrsamt stellen",
      "Schwerbehindertenausweis vorlegen",
      "Passfoto abgeben",
      "Parkausweis wird ausgestellt",
      "Gültigkeit: meist 5 Jahre"
    ],
    contact: {
      office: "Straßenverkehrsamt Kreis Lippe",
      phone: "05231 / 62-0",
      email: "strassenverkehrsamt@kreis-lippe.de",
      hours: "Mo-Fr: 7:30-12:00 Uhr, Do: 14:00-17:30 Uhr"
    }
  },
  {
    title: "Fischereierlaubnisschein",
    description: "Erlaubnis zum Angeln in örtlichen Gewässern",
    details: "Zum Angeln in den Gewässern von Schieder-Schwalenberg benötigen Sie einen Fischereischein und einen Fischereierlaubnisschein.",
    requirements: [
      "Gültiger Fischereischein (nach bestandener Fischerprüfung)",
      "Personalausweis",
      "Passfoto"
    ],
    process: [
      "Fischereischein beim Ordnungsamt beantragen",
      "Fischereierlaubnisschein beim Angelverein oder Gewässerwart kaufen",
      "Gebühren bezahlen (variiert je nach Gewässer und Zeitraum)",
      "Erlaubnisschein erhalten",
      "Beim Angeln beide Scheine mitführen"
    ],
    contact: {
      office: "Ordnungsamt",
      phone: "05282 / 601-0",
      email: "ordnungsamt@schieder-schwalenberg.de",
      hours: "Mo-Fr: 8:00-12:00 Uhr"
    }
  }
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

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
          <h1 className="text-3xl font-bold">Bürger-Services</h1>
          <p className="text-primary-foreground/90 mt-1">Online-Dienste und Formulare</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-4">
          {servicesData.map((service, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedService(service)}>
              <div className="flex items-start gap-4">
                <FileText size={24} className="text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1">{service.title}</h2>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink size={14} className="mr-2" />
                  Mehr
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-3xl my-8">
            {/* Header */}
            <div className="sticky top-0 bg-primary text-primary-foreground p-6 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-bold">{selectedService.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedService(null)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <p className="text-muted-foreground">{selectedService.details}</p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  Benötigte Unterlagen
                </h3>
                <ul className="space-y-2">
                  {selectedService.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Process */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  Ablauf
                </h3>
                <ol className="space-y-2">
                  {selectedService.process.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Contact */}
              {selectedService.contact && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Kontakt & Öffnungszeiten</h3>
                  <div className="space-y-2 text-sm">
                    {selectedService.contact.office && (
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{selectedService.contact.office}</span>
                      </div>
                    )}
                    {selectedService.contact.phone && (
                      <div className="flex items-start gap-2">
                        <Phone size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <a href={`tel:${selectedService.contact.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
                          {selectedService.contact.phone}
                        </a>
                      </div>
                    )}
                    {selectedService.contact.email && (
                      <div className="flex items-start gap-2">
                        <Mail size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <a href={`mailto:${selectedService.contact.email}`} className="text-primary hover:underline">
                          {selectedService.contact.email}
                        </a>
                      </div>
                    )}
                    {selectedService.contact.hours && (
                      <div className="flex items-start gap-2">
                        <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{selectedService.contact.hours}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={() => setSelectedService(null)}>
                  Schließen
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

