import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, Clock, User } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface Employee {
  name: string;
  position: string;
  phone: string;
  fax?: string;
  email: string;
  room?: string;
  address: string;
  hours?: string;
}

interface Department {
  name: string;
  employees: Employee[];
}

const departmentsData: Department[] = [
  {
    name: "Bürgermeister",
    employees: [
      {
        name: "Jörg Bierwirth",
        position: "Bürgermeister",
        phone: "05282 / 601-11",
        fax: "05282 / 601-911",
        email: "joerg.bierwirth@schieder-schwalenberg.de",
        room: "Raum 4",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      }
    ]
  },
  {
    name: "Fachbereich Finanzen und Organisation",
    employees: [
      {
        name: "Swen Horstmann",
        position: "Fachbereichsleiter, Kämmerer",
        phone: "05282 / 601-40",
        fax: "05282 / 601-940",
        email: "swen.horstmann@schieder-schwalenberg.de",
        room: "Raum 24",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Sandra Eichmann",
        position: "Vorzimmer",
        phone: "05282 / 601-12",
        fax: "05282 / 601-912",
        email: "sandra.eichmann@schieder-schwalenberg.de",
        room: "Raum 3",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Sonja Horbach",
        position: "Personalservice",
        phone: "05282 / 601-16",
        fax: "05282 / 601-916",
        email: "sonja.horbach@schieder-schwalenberg.de",
        room: "Raum 20",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Ronald Erfurth",
        position: "Steuern, Grundbesitzabgaben, Abfallbeseitigung",
        phone: "05282 / 601-22",
        fax: "05282 / 601-922",
        email: "ronald.erfurth@schieder-schwalenberg.de",
        room: "Raum 19",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Simone Baumeister",
        position: "Anlagenbuchhaltung",
        phone: "05282 / 601-23",
        fax: "05282 / 601-923",
        email: "simone.baumeister@schieder-schwalenberg.de",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Kristin Echterling",
        position: "Finanzbuchhaltung",
        phone: "05282 / 601-24",
        email: "kristin.echterling@schieder-schwalenberg.de",
        room: "Raum 23",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Sandra Cotte",
        position: "Zahlungsabwicklung",
        phone: "05282 / 601-28",
        fax: "05282 / 601-928",
        email: "sandra.cotte@schieder-schwalenberg.de",
        room: "Raum 22",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Laura Blome-Haase",
        position: "Schulverwaltung, Finanzbuchhaltung",
        phone: "05282 / 601-65",
        fax: "05282 / 601-965",
        email: "laura.blome-haase@schieder-schwalenberg.de",
        address: "Domäne 3, 32816 Schieder-Schwalenberg",
        hours: "Mo-Fr 8 - 12 Uhr"
      }
    ]
  },
  {
    name: "Fachbereich Ordnung und Soziales",
    employees: [
      {
        name: "Mathias Koch",
        position: "Fachbereichsleiter",
        phone: "05282 / 601-51",
        email: "mathias.koch@schieder-schwalenberg.de",
        room: "Raum 2",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Astrid Hagedorn",
        position: "Einwohnermeldewesen, Pass- und Ausweiswesen, Fundbüro, Führungszeugnis, Rentenangelegenheiten",
        phone: "05282 / 601-33 (Meldewesen), 05282 / 601-52 (Rente)",
        fax: "05282 / 601-933, 05282 / 601-952",
        email: "astrid.hagedorn@schieder-schwalenberg.de",
        room: "Raum 8",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Sabine Haedrich",
        position: "Soziales",
        phone: "05282 / 601-53",
        fax: "05282 / 601-953",
        email: "sabine.haedrich@schieder-schwalenberg.de",
        room: "Raum 6",
        address: "Domäne 3, 32816 Schieder-Schwalenberg",
        hours: "Mo-Di 8 - 12 Uhr, Do 8 - 12 Uhr und 14 - 17 Uhr, Fr 8 - 12 Uhr"
      },
      {
        name: "Indra Krome",
        position: "Wohngeldstelle Buchstaben A-K",
        phone: "05282 / 601-34",
        fax: "05282 / 601-934",
        email: "indra.krome@schieder-schwalenberg.de",
        room: "Raum 7",
        address: "Domäne 3, 32816 Schieder-Schwalenberg",
        hours: "Mo-Di 8 - 12 Uhr, Do 8 - 12 Uhr und 14 - 17 Uhr, Fr 8 - 12 Uhr"
      },
      {
        name: "Andrea Hoppe",
        position: "Wohngeldstelle Buchstaben L-Z",
        phone: "05282 / 601-25",
        fax: "05282 / 601-925",
        email: "andrea.hoppe@schieder-schwalenberg.de",
        address: "Domäne 3, 32816 Schieder-Schwalenberg",
        hours: "Mo-Di 8 - 12 Uhr, Do 8 - 12 Uhr, Fr 8 - 12 Uhr"
      }
    ]
  },
  {
    name: "Fachbereich Stadtentwicklung",
    employees: [
      {
        name: "Jochen Heering",
        position: "Fachbereichsleiter, allgem. Vertreter des Bürgermeisters",
        phone: "05282 / 601-13",
        fax: "05282 / 601-913",
        email: "jochen.heering@schieder-schwalenberg.de",
        room: "Raum OG1",
        address: "Im Kurpark 1, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Reinhard Büker",
        position: "Hochbau, Bauhof",
        phone: "05282 / 601-66",
        fax: "05282 / 601-966",
        email: "reinhard.bueker@schieder-schwalenberg.de",
        room: "Raum OG8",
        address: "Im Kurpark 1, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Andrea Bärsch",
        position: "Bauanträge, Bauleitplanung, Beitragsrecht, Denkmalschutz",
        phone: "05282 / 601-67",
        fax: "05282 / 601-967",
        email: "andrea.baersch@schieder-schwalenberg.de",
        room: "Raum OG4",
        address: "Im Kurpark 1, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Maria Litke",
        position: "Stadtentwicklung",
        phone: "05282 / 601-70",
        fax: "05282 / 601-970",
        email: "maria.litke@schieder-schwalenberg.de",
        room: "Raum OG3",
        address: "Im Kurpark 1, 32816 Schieder-Schwalenberg",
        hours: "Mo-Fr 8 - 12 Uhr"
      },
      {
        name: "Michael Bickel",
        position: "Tiefbau, Abwasserbeseitigung, Energie, Gewässer",
        phone: "05282 / 601-75",
        fax: "05282 / 601-975",
        email: "michael.bickel@schieder-schwalenberg.de",
        room: "Raum OG5",
        address: "Im Kurpark 1, 32816 Schieder-Schwalenberg"
      }
    ]
  },
  {
    name: "Bauhof",
    employees: [
      {
        name: "Mario Bezjak",
        position: "Bauhofleiter",
        phone: "05282 / 601-500",
        fax: "05282 / 6019-500",
        email: "mario.bezjak@schieder-schwalenberg.de",
        address: "Domäne 12, 32816 Schieder-Schwalenberg"
      }
    ]
  },
  {
    name: "Bürger- und Gästeinformation",
    employees: [
      {
        name: "Jasmin Baier",
        position: "Bürger- und Gästeinformation Schieder",
        phone: "05282 / 601-10",
        email: "jasmin.baier@schieder-schwalenberg.de",
        room: "Raum 1",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Denise Kieslich",
        position: "Touristinfo Schwalenberg",
        phone: "05282 / 60194",
        fax: "05282 / 601994",
        email: "denise.kieslich@schieder-schwalenberg.de",
        address: "Marktstraße 5, 32816 Schieder-Schwalenberg"
      }
    ]
  },
  {
    name: "Sonstige",
    employees: [
      {
        name: "Hans-Georg Müller",
        position: "Betreuung in den Unterkünften",
        phone: "05282 / 601-54",
        email: "hans-georg.mueller@schieder-schwalenberg.de",
        room: "Raum 10",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      },
      {
        name: "Joann Hamm",
        position: "Auszubildende",
        phone: "",
        email: "joann.hamm@schieder-schwalenberg.de",
        address: "Domäne 3, 32816 Schieder-Schwalenberg"
      }
    ]
  }
];

export default function Departments() {
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

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
          <h1 className="text-3xl font-bold">Rathaus & Verwaltung</h1>
          <p className="text-primary-foreground/90 mt-1">Ämter und Ansprechpartner</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-4">
          {departmentsData.map((dept, deptIndex) => (
            <Card key={deptIndex} className="overflow-hidden">
              <button
                onClick={() => setExpandedDept(expandedDept === dept.name ? null : dept.name)}
                className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{dept.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {dept.employees.length} {dept.employees.length === 1 ? 'Mitarbeiter' : 'Mitarbeiter'}
                    </p>
                  </div>
                  <div className={`transition-transform ${expandedDept === dept.name ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </div>
              </button>

              {expandedDept === dept.name && (
                <div className="border-t border-border">
                  {dept.employees.map((employee, empIndex) => (
                    <div key={empIndex} className="p-6 border-b border-border last:border-b-0 bg-muted/20">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <User size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{employee.name}</h3>
                          <p className="text-sm text-muted-foreground">{employee.position}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-sm ml-11">
                        {employee.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-muted-foreground" />
                            <a href={`tel:${employee.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
                              {employee.phone}
                            </a>
                          </div>
                        )}
                        
                        {employee.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-muted-foreground" />
                            <a href={`mailto:${employee.email}`} className="text-primary hover:underline break-all">
                              {employee.email}
                            </a>
                          </div>
                        )}

                        {employee.room && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-muted-foreground" />
                            <span className="text-muted-foreground">{employee.room}</span>
                          </div>
                        )}

                        {employee.address && (
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-muted-foreground mt-0.5" />
                            <span className="text-muted-foreground">{employee.address}</span>
                          </div>
                        )}

                        {employee.hours && (
                          <div className="flex items-start gap-2 md:col-span-2">
                            <Clock size={14} className="text-muted-foreground mt-0.5" />
                            <span className="text-muted-foreground">{employee.hours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

