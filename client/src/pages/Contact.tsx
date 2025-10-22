import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Phone, Mail, MapPin, Send } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Ihr Anliegen wurde erfolgreich übermittelt!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
    onError: () => {
      toast.error("Fehler beim Senden. Bitte versuchen Sie es erneut.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      toast.error("Bitte geben Sie Ihr Anliegen ein");
      return;
    }

    submitMutation.mutate({
      name: name || "Anonym",
      email: email || undefined,
      subject: subject || "Allgemeines Anliegen",
      message,
    });
  };

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
          <h1 className="text-3xl font-bold">Kontakt & Anliegen</h1>
          <p className="text-primary-foreground/90 mt-1">So erreichen Sie uns</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Contact Form */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Ihr Anliegen</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Haben Sie eine Frage oder ein Anliegen? Schreiben Sie uns direkt über dieses Formular.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ihr Name"
                />
              </div>
              <div>
                <Label htmlFor="email">E-Mail (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.de"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Für Rückmeldungen bitte E-Mail angeben
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Betreff (optional)</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Worum geht es?"
              />
            </div>

            <div>
              <Label htmlFor="message">Ihr Anliegen *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Beschreiben Sie Ihr Anliegen..."
                rows={6}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full md:w-auto"
            >
              <Send size={16} className="mr-2" />
              {submitMutation.isPending ? "Wird gesendet..." : "Anliegen absenden"}
            </Button>
          </form>
        </Card>

        {/* Contact Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Stadtverwaltung Schieder-Schwalenberg</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-muted-foreground">Rathausplatz 1</p>
                <p className="text-muted-foreground">32816 Schieder-Schwalenberg</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-primary" />
              <div>
                <p className="font-medium">Telefon</p>
                <a href="tel:+4952822640" className="text-primary hover:underline">05282 / 26-40</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-primary" />
              <div>
                <p className="font-medium">E-Mail</p>
                <a href="mailto:info@schieder-schwalenberg.de" className="text-primary hover:underline">
                  info@schieder-schwalenberg.de
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* Opening Hours */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Öffnungszeiten</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Montag - Freitag:</span>
              <span className="text-muted-foreground">08:00 - 12:00 Uhr</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Donnerstag:</span>
              <span className="text-muted-foreground">14:00 - 18:00 Uhr</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

