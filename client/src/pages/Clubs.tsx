import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Users, Trophy, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";

interface Club {
  id: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  category: 'sport' | 'general';
}

const clubs: Club[] = [
  // Sportvereine
  { id: 's1', name: 'Pyrmonter Segel- und Wassersportclub e.V.', category: 'sport', phone: '05236/256', website: 'www.pysc.de' },
  { id: 's2', name: 'Angelsportverein Schieder', category: 'sport', contact: 'Marc Beckmeier', address: 'Pyrmonter Straße 10, 32816 Schieder-Schwalenberg' },
  { id: 's3', name: 'Angelsportverein Schieder-Glashütte', category: 'sport', contact: 'Rinat Schwarzkopf', phone: '05235/97729' },
  { id: 's4', name: 'FC Schalke 04 Fan-Club Brakelsiek', category: 'sport', contact: 'Peter Meinberg', phone: '0170/2139056' },
  { id: 's5', name: 'Luftsportgemeinschaft Lippe Südost e.V.', category: 'sport', website: 'www.lsg-lippe.de' },
  { id: 's6', name: 'Modellflugclub Burgschwalbe', category: 'sport', contact: 'Dirk Vogel', phone: '05282/2084968', website: 'www.mfc-burgschwalbe.jimdo.com' },
  { id: 's7', name: 'Schützengruppe Siekholz', category: 'sport', contact: 'Werner Ridder', phone: '0160 1806290', website: 'www.siekholz.de' },
  { id: 's8', name: 'DLRG Ortsgruppe Schieder-Schwalenberg', category: 'sport', contact: 'Bodo Schultz', phone: '05282/258', website: 'www.schieder-schwalenberg.dlrg.de' },
  { id: 's9', name: 'Kanu-Club Schieder e.V.', category: 'sport', contact: 'Christof Basener', phone: '05151/821582' },
  { id: 's10', name: 'Ruderclub Schieder am Emmerstausee von 1985 e.V.', category: 'sport', website: 'www.ruderclub-schieder.de', phone: '05234-204845' },
  { id: 's11', name: 'Schießsportverein Lothe', category: 'sport', contact: 'Meik Waldvogt', phone: '05233/953652' },
  { id: 's12', name: 'Segel-Club Hameln e. V.', category: 'sport', phone: '05151/980855', website: 'www.segel-club-hameln.de' },
  { id: 's13', name: 'Segel-Club Schieder-Emmersee', category: 'sport', website: 'www.scse.de' },
  { id: 's14', name: 'Tennisclub Schieder-Schwalenberg', category: 'sport', contact: 'Stephan Müller', phone: '05282 208 312', website: 'www.tennisclub-schieder.de' },
  { id: 's15', name: 'TG Siekholz', category: 'sport', contact: 'Martin Schulz', phone: '05282/969556' },
  { id: 's16', name: 'TSV Lothe', category: 'sport', contact: 'Rolf Unglaube', phone: '05233/4717', website: 'www.tsv-lothe.de' },
  { id: 's17', name: 'TuS Wöbbel', category: 'sport', contact: 'Christian Hansmann', phone: '05233/4710' },
  { id: 's18', name: 'TuS 08 Brakelsiek', category: 'sport', contact: 'Hartmut Tewesmeier', phone: '05284 5481', website: 'www.tus08brakelsiek.de' },
  { id: 's19', name: 'TuS Schieder-Schwalenberg', category: 'sport', contact: 'Kerstin Monsehr', website: 'www.tus-schieder-schwalenberg.de' },
  
  // Allgemeine Vereine (Top 30)
  { id: 'v1', name: 'OPEL-Club Schieder-Schwalenberg', category: 'general', contact: 'Sascha Schröder', phone: '05284/5527', website: 'www.opelclub-schieder-schwalenberg.de' },
  { id: 'v2', name: 'PS-Freunde Lippe', category: 'general', contact: 'Stefan Hilkemeier' },
  { id: 'v3', name: 'Schwalenberger Brauzunft', category: 'general', contact: 'Udo Strüber', phone: '0151/14 22 39 57', website: 'www.schwalenberger-brauzunft.de' },
  { id: 'v4', name: 'Trachtengilde Schwalenberg', category: 'general', contact: 'André Eikermann', phone: '05284/5639', website: 'www.trachtengilde-schwalenberg.de' },
  { id: 'v5', name: 'VFDG - Verein zur Förderung alter Lippischer Gebräuche', category: 'general', contact: 'Frank Wiehemeier', phone: '05282/948263' },
  { id: 'v6', name: 'Wanderarbeiterverein Lothe', category: 'general', contact: 'Jürgen Rogat', phone: '05233/5860' },
  { id: 'v7', name: 'Dachkammer-Chor', category: 'general', contact: 'Teo Wedding' },
  { id: 'v8', name: 'MGV Wöbbel', category: 'general', contact: 'Ludolf Beermann', phone: '05233/8349', website: 'choralle-mgv.de' },
  { id: 'v9', name: 'Musikzug der Freiwilligen Feuerwehr', category: 'general', website: 'www.feuerwehr-schieder-schwalenberg.de' },
  { id: 'v10', name: 'Ökumenischer Chor', category: 'general', contact: 'Guido Theis', phone: '05282/6635' },
  { id: 'v11', name: 'Spielmannszug Brakelsiek', category: 'general', contact: 'Larissa Wienke', website: 'www.brakelsiek.de' },
  { id: 'v12', name: 'Europäisches Laboratorium e.V.', category: 'general', phone: '05284/9439473', website: 'eu-lab.de' },
  { id: 'v13', name: 'Förderverein der Grundschule Schwalenberg', category: 'general', contact: 'Fabienne Schweizer', phone: '05282-601 600', website: 'www.gs-schwalenberg.de' },
  { id: 'v14', name: 'Förderverein der Brakelsieker Mehrzweckhalle', category: 'general', contact: 'Wolfgang Ridder', phone: '05284/5366' },
  { id: 'v15', name: 'Förderverein der Grundschule Schieder', category: 'general', contact: 'Sonja Morgenthal' },
  { id: 'v16', name: 'Bürgerstiftung Schwalenberg', category: 'general', contact: 'Marcus Rohde', phone: '0170 6312734', website: 'www.buergerstiftung-schwalenberg.de' },
  { id: 'v17', name: 'Förderverein Jugendfeuerwehr Schieder-Schwalenberg', category: 'general', contact: 'Marco Tölle', website: 'www.feuerwehr-schieder-schwalenberg.de' },
  { id: 'v18', name: 'Förderverein Löschzug Schieder', category: 'general', contact: 'Heinz-Günter Ermer', phone: '05284/5869', website: 'www.feuerwehr-schieder-schwalenberg.de' },
  { id: 'v19', name: 'Förderverein Schloss und Schlosspark Schieder', category: 'general', contact: 'Detlev Hundt', phone: '05282/96 93 01', website: 'www.schlosspark-schieder.de' },
  { id: 'v20', name: 'Ankerplatz - Offene Jugendarbeit', category: 'general', contact: 'Maike Derstvensek', phone: '05232-79 85 987' },
];

export default function Clubs() {
  const [activeTab, setActiveTab] = useState<'sport' | 'general'>('sport');

  const sportClubs = clubs.filter(c => c.category === 'sport');
  const generalClubs = clubs.filter(c => c.category === 'general');

  const displayClubs = activeTab === 'sport' ? sportClubs : generalClubs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="container">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Vereine</h1>
          <p className="text-primary-foreground/90 mt-2">
            Vereine und Sportvereine in Schieder-Schwalenberg
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === 'sport' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sport')}
            className="flex-1"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Sportvereine ({sportClubs.length})
          </Button>
          <Button
            variant={activeTab === 'general' ? 'default' : 'outline'}
            onClick={() => setActiveTab('general')}
            className="flex-1"
          >
            <Users className="mr-2 h-4 w-4" />
            Vereine ({generalClubs.length})
          </Button>
        </div>

        {/* Clubs List */}
        <div className="grid gap-4">
          {displayClubs.map((club) => (
            <Card key={club.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  {activeTab === 'sport' ? (
                    <Trophy className="h-6 w-6 text-primary" />
                  ) : (
                    <Users className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{club.name}</h3>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {club.contact && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{club.contact}</span>
                      </div>
                    )}
                    {club.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${club.phone}`} className="hover:text-primary">
                          {club.phone}
                        </a>
                      </div>
                    )}
                    {club.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${club.email}`} className="hover:text-primary">
                          {club.email}
                        </a>
                      </div>
                    )}
                    {club.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{club.address}</span>
                      </div>
                    )}
                    {club.website && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        <a 
                          href={`https://${club.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary hover:underline"
                        >
                          {club.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="mt-8 p-6 bg-muted/50">
          <h3 className="font-semibold mb-2">Weitere Informationen</h3>
          <p className="text-sm text-muted-foreground">
            Insgesamt sind {clubs.length} Vereine in Schieder-Schwalenberg registriert. 
            Für weitere Informationen zu den Vereinen besuchen Sie bitte die 
            <a 
              href="https://www.schieder-schwalenberg.de/Familie-und-Soziales/Sport-und-Freizeitstätten/Vereine/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              offizielle Website der Stadt
            </a>.
          </p>
        </Card>
      </div>
    </div>
  );
}

