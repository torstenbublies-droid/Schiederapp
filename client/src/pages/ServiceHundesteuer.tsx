import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Dog, Check } from "lucide-react";
import { Link } from "wouter";

export default function ServiceHundesteuer() {
  const [activeTab, setActiveTab] = useState<"anmelden" | "abmelden">("anmelden");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to API or email placeholder
    console.log("Form submitted");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="bg-amber-600 text-white py-8">
          <div className="container">
            <Link href="/services">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zu Services
              </Button>
            </Link>
          </div>
        </div>

        <div className="container py-8 max-w-3xl">
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full">
                <Check className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Vielen Dank!</h2>
            <p className="text-muted-foreground mb-6">
              Ihre Meldung wurde erfolgreich übermittelt. Sie erhalten in Kürze eine 
              Bestätigung per E-Mail.
            </p>
            <Link href="/services">
              <Button>Zurück zu Services</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-amber-600 text-white py-8">
        <div className="container">
          <Link href="/services">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zu Services
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Dog size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Hund anmelden/abmelden</h1>
              <p className="text-white/90 mt-1">Hundesteuer online melden</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Hundesteuer melden</h2>
              <p className="text-muted-foreground text-lg">
                Hundesteuer einfach online melden. Angaben zu Halter:in und Hund ausfüllen, 
                SEPA-Mandat erteilen – Bestätigung per E-Mail.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b">
              <button
                className={`pb-3 px-4 font-medium transition-colors ${
                  activeTab === "anmelden"
                    ? "border-b-2 border-amber-600 text-amber-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("anmelden")}
              >
                Hund anmelden
              </button>
              <button
                className={`pb-3 px-4 font-medium transition-colors ${
                  activeTab === "abmelden"
                    ? "border-b-2 border-amber-600 text-amber-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("abmelden")}
              >
                Hund abmelden
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Halter */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Angaben zum Halter</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vorname">Vorname *</Label>
                    <Input id="vorname" required />
                  </div>
                  <div>
                    <Label htmlFor="nachname">Nachname *</Label>
                    <Input id="nachname" required />
                  </div>
                  <div>
                    <Label htmlFor="strasse">Straße *</Label>
                    <Input id="strasse" required />
                  </div>
                  <div>
                    <Label htmlFor="hausnr">Hausnummer *</Label>
                    <Input id="hausnr" required />
                  </div>
                  <div>
                    <Label htmlFor="plz">PLZ *</Label>
                    <Input id="plz" defaultValue="32816" required />
                  </div>
                  <div>
                    <Label htmlFor="ort">Ort *</Label>
                    <Input id="ort" defaultValue="Schieder-Schwalenberg" required />
                  </div>
                  <div>
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="telefon">Telefon</Label>
                    <Input id="telefon" type="tel" />
                  </div>
                </div>
              </div>

              {/* Hund */}
              {activeTab === "anmelden" && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Angaben zum Hund</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hundename">Name des Hundes *</Label>
                        <Input id="hundename" required />
                      </div>
                      <div>
                        <Label htmlFor="rasse">Rasse / Mix *</Label>
                        <Input id="rasse" required />
                      </div>
                      <div>
                        <Label htmlFor="geburtsdatum">Geburtsdatum</Label>
                        <Input id="geburtsdatum" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="geschlecht">Geschlecht</Label>
                        <select id="geschlecht" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                          <option value="">Bitte wählen</option>
                          <option value="m">Männlich</option>
                          <option value="w">Weiblich</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="chipnr">Chip-Nummer</Label>
                        <Input id="chipnr" />
                      </div>
                      <div>
                        <Label htmlFor="haltungsbeginn">Haltungsbeginn *</Label>
                        <Input id="haltungsbeginn" type="date" required />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="zuzug" />
                      <Label htmlFor="zuzug" className="font-normal">
                        Zuzug aus anderer Gemeinde
                      </Label>
                    </div>
                  </div>

                  {/* SEPA */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">SEPA-Lastschriftmandat</h3>
                    <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                      <p>
                        Ich ermächtige die Stadt Schieder-Schwalenberg, Zahlungen von meinem Konto 
                        mittels Lastschrift einzuziehen. Die Mandatsreferenz wird separat mitgeteilt.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="iban">IBAN *</Label>
                        <Input id="iban" placeholder="DE00 0000 0000 0000 0000 00" required />
                      </div>
                      <div>
                        <Label htmlFor="kontoinhaber">Kontoinhaber:in *</Label>
                        <Input id="kontoinhaber" required />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "abmelden" && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Angaben zur Abmeldung</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hundename_abmelden">Name des Hundes *</Label>
                      <Input id="hundename_abmelden" required />
                    </div>
                    <div>
                      <Label htmlFor="steuernummer">Steuernummer (falls bekannt)</Label>
                      <Input id="steuernummer" />
                    </div>
                    <div>
                      <Label htmlFor="abmeldedatum">Abmeldedatum *</Label>
                      <Input id="abmeldedatum" type="date" required />
                    </div>
                    <div>
                      <Label htmlFor="grund">Grund</Label>
                      <select id="grund" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                        <option value="">Bitte wählen</option>
                        <option value="tod">Tod des Hundes</option>
                        <option value="verkauf">Verkauf/Abgabe</option>
                        <option value="wegzug">Wegzug</option>
                        <option value="sonstiges">Sonstiges</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Datenschutz */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="datenschutz" required />
                  <Label htmlFor="datenschutz" className="font-normal text-sm">
                    Ich habe die Datenschutzhinweise zur Kenntnis genommen und stimme der 
                    Verarbeitung meiner Daten zu. *
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" size="lg">
                <Dog className="mr-2 h-5 w-5" />
                Jetzt Hund {activeTab === "anmelden" ? "anmelden" : "abmelden"}
              </Button>
            </form>

            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">Hinweise</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Die Hundesteuer beträgt derzeit 60 € pro Jahr (1. Hund)</p>
                <p>• Für jeden weiteren Hund: 90 € pro Jahr</p>
                <p>• Ermäßigungen sind möglich (z.B. für Assistenzhunde)</p>
                <p>• Bei Fragen: 05282 / 601-0</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

