import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface Institution {
  name: string;
  address: string;
  city: string;
  phone: string;
  fax?: string;
  email?: string;
  website?: string;
}

const kitas: Institution[] = [
  {
    name: 'AWO - Kindertagesstätte "Drachennest"',
    address: "Tulpenstraße 16",
    city: "32816 Schieder-Schwalenberg",
    phone: "05233 / 93795",
    email: "drachennest@awo-lippe.de"
  },
  {
    name: 'DRK Kindergarten "Wurzelhöhle"',
    address: "Ahornweg 5",
    city: "32816 Schieder-Schwalenberg",
    phone: "05233 / 93971",
    email: "wurzelhoehle@drk-lippe.de"
  },
  {
    name: 'Kindergarten "Wildblume" der Evangelisch-reformierten Kirchengemeinde Schwalenberg',
    address: "Auf der Höhe 8",
    city: "32816 Schieder-Schwalenberg",
    phone: "05284 / 331",
    email: "wildblume@kirche-schwalenberg.de"
  },
  {
    name: "Katholischer Kindergarten St. Joseph",
    address: "Domäne 9",
    city: "32816 Schieder-Schwalenberg",
    phone: "05282 / 8246",
    email: "st.joseph@kath-kiga-schieder.de"
  },
  {
    name: 'Städtischer Kindergarten "Rappelkiste"',
    address: "Schubertstraße 10",
    city: "32816 Schieder-Schwalenberg",
    phone: "05282 / 6342",
    email: "rappelkiste@schieder-schwalenberg.de"
  },
  {
    name: "Tageseinrichtung im SOS-Kinderdorf Lippe",
    address: "Forstweg 1",
    city: "32816 Schieder-Schwalenberg",
    phone: "05284 / 94 27 16",
    email: "kita@sos-kinderdorf-lippe.de"
  }
];

const schulen: Institution[] = [
  {
    name: "Grundschule am Schloßpark",
    address: "Parkallee 7",
    city: "32816 Schieder-Schwalenberg",
    phone: "05282 / 601-700",
    fax: "05282 / 601-9700",
    email: "gs-schlosspark@schieder-schwalenberg.de"
  },
  {
    name: "Alexander-Zeiß-Grundschule",
    address: "Brinkfeldweg 2",
    city: "32816 Schieder-Schwalenberg",
    phone: "05282 / 601-600",
    fax: "05282 / 601-9600",
    email: "alexander-zeiss-gs@schieder-schwalenberg.de"
  },
  {
    name: "VHS Lippe-Ost",
    address: "Volkshochschule für Erwachsenenbildung",
    city: "Lippe-Ost",
    phone: "",
    website: "https://www.vhslippe-ost.de"
  }
];

export default function Education() {
  const [activeTab, setActiveTab] = useState<"kitas" | "schulen">("kitas");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-purple-600 text-white py-8">
        <div className="container">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Bildung & Familie</h1>
          <p className="text-white/90 mt-2">
            Kitas, Schulen und Bildungseinrichtungen in Schieder-Schwalenberg
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b mb-8">
          <button
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "kitas"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("kitas")}
          >
            Kitas ({kitas.length})
          </button>
          <button
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === "schulen"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("schulen")}
          >
            Schulen ({schulen.length})
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-6">
          {activeTab === "kitas" && kitas.map((kita, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4">{kita.name}</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{kita.address}</p>
                    <p>{kita.city}</p>
                  </div>
                </div>
                {kita.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 flex-shrink-0" />
                    <a 
                      href={`tel:${kita.phone.replace(/\s/g, '')}`}
                      className="text-primary hover:underline"
                    >
                      {kita.phone}
                    </a>
                  </div>
                )}
                {kita.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 flex-shrink-0" />
                    <a 
                      href={`mailto:${kita.email}`}
                      className="text-primary hover:underline"
                    >
                      {kita.email}
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {activeTab === "schulen" && schulen.map((schule, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4">{schule.name}</h3>
              <div className="space-y-3">
                {schule.address && (
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{schule.address}</p>
                      <p>{schule.city}</p>
                    </div>
                  </div>
                )}
                {schule.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 flex-shrink-0" />
                    <a 
                      href={`tel:${schule.phone.replace(/\s/g, '')}`}
                      className="text-primary hover:underline"
                    >
                      {schule.phone}
                    </a>
                  </div>
                )}
                {schule.fax && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5 flex-shrink-0" />
                    <span>Fax: {schule.fax}</span>
                  </div>
                )}
                {schule.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 flex-shrink-0" />
                    <a 
                      href={`mailto:${schule.email}`}
                      className="text-primary hover:underline"
                    >
                      {schule.email}
                    </a>
                  </div>
                )}
                {schule.website && (
                  <div className="mt-4">
                    <Button 
                      onClick={() => window.open(schule.website, "_blank")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Zur Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

