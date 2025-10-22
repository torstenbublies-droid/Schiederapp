# Deployment Guide: Vercel + Supabase + GitHub

Diese Anleitung führt Sie Schritt für Schritt durch das Deployment der Bürger-App auf Vercel mit Supabase als Datenbank und automatischem Deployment über GitHub.

## 📋 Übersicht

Nach diesem Setup:
- ✅ Code liegt auf GitHub
- ✅ Automatisches Deployment bei jedem Git Push
- ✅ PostgreSQL Datenbank auf Supabase
- ✅ Production-ready auf Vercel

---

## 1️⃣ GitHub Repository erstellen

### Option A: Mit GitHub CLI (gh)

```bash
# Im Projektverzeichnis
cd /home/ubuntu/buergerapp-schieder

# Repository erstellen und pushen
gh repo create buergerapp-schieder --public --source=. --remote=origin --push
```

### Option B: Manuell über GitHub Website

1. Gehen Sie zu [github.com/new](https://github.com/new)
2. Repository Name: `buergerapp-schieder`
3. Beschreibung: "Digitale Stadtverwaltung für Schieder-Schwalenberg"
4. Wählen Sie **Public** oder **Private**
5. **NICHT** "Initialize with README" ankreuzen
6. Klicken Sie auf "Create repository"

7. Dann im Terminal:
```bash
cd /home/ubuntu/buergerapp-schieder
git remote add origin https://github.com/IHR-USERNAME/buergerapp-schieder.git
git push -u origin main
```

---

## 2️⃣ Supabase Projekt erstellen

### Schritt 1: Account erstellen
1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Klicken Sie auf "Start your project"
3. Melden Sie sich mit GitHub an (empfohlen)

### Schritt 2: Neues Projekt erstellen
1. Klicken Sie auf "New Project"
2. **Organization**: Wählen Sie Ihre Organisation
3. **Project Name**: `buergerapp-schieder`
4. **Database Password**: Generieren Sie ein sicheres Passwort (WICHTIG: Speichern Sie es!)
5. **Region**: Wählen Sie die nächstgelegene Region (z.B. Frankfurt)
6. **Pricing Plan**: Free (ausreichend für den Start)
7. Klicken Sie auf "Create new project"

⏱️ Die Projekterstellung dauert ca. 2 Minuten.

### Schritt 3: Connection String kopieren
1. Gehen Sie zu **Project Settings** (Zahnrad-Symbol links unten)
2. Klicken Sie auf **Database** im Menü
3. Scrollen Sie zu "Connection string"
4. Wählen Sie **URI** Tab
5. Kopieren Sie den Connection String

Format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

⚠️ Ersetzen Sie `[YOUR-PASSWORD]` mit Ihrem Datenbank-Passwort!

---

## 3️⃣ Vercel Projekt erstellen

### Schritt 1: Account erstellen
1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Klicken Sie auf "Sign Up"
3. Melden Sie sich mit **GitHub** an (wichtig!)
4. Autorisieren Sie Vercel für GitHub

### Schritt 2: Projekt importieren
1. Klicken Sie auf "Add New..." → "Project"
2. Wählen Sie Ihr GitHub Repository `buergerapp-schieder`
3. Falls nicht sichtbar: Klicken Sie auf "Adjust GitHub App Permissions"

### Schritt 3: Projekt konfigurieren

**Framework Preset**: Vite  
**Root Directory**: `./` (Standard)  
**Build Command**: `pnpm build`  
**Output Directory**: `dist/public`

### Schritt 4: Environment Variables setzen

Klicken Sie auf "Environment Variables" und fügen Sie folgende Variablen hinzu:

```env
# Datenbank (von Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Security
JWT_SECRET=ihr-super-sicherer-jwt-secret-mindestens-32-zeichen

# App Configuration
VITE_APP_ID=proj_buergerapp_schieder
VITE_APP_TITLE=Bürger-App Schieder-Schwalenberg
VITE_APP_LOGO=https://placehold.co/40x40/3b82f6/ffffff?text=S

# OAuth
OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev
VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev

# Optional: Analytics
VITE_ANALYTICS_ENDPOINT=https://umami.dev.ops.butterfly-effect.dev
VITE_ANALYTICS_WEBSITE_ID=analytics_proj_buergerapp_schieder
```

**Wichtig**: 
- Ersetzen Sie `[PASSWORD]` und `[PROJECT-REF]` mit Ihren Supabase-Werten
- Generieren Sie einen sicheren `JWT_SECRET` (z.B. mit `openssl rand -base64 32`)

### Schritt 5: Deploy
1. Klicken Sie auf "Deploy"
2. ⏱️ Der erste Build dauert ca. 2-3 Minuten
3. Nach erfolgreichem Build erhalten Sie eine URL: `https://buergerapp-schieder.vercel.app`

---

## 4️⃣ Datenbank initialisieren

### Methode 1: Über Supabase Dashboard

1. Gehen Sie zu Ihrem Supabase Projekt
2. Klicken Sie auf **SQL Editor** im Menü
3. Klicken Sie auf "New query"
4. Führen Sie folgendes SQL aus:

```sql
-- Erstelle Enums
CREATE TYPE role AS ENUM ('user', 'admin');
CREATE TYPE issue_status AS ENUM ('eingegangen', 'in_bearbeitung', 'erledigt');
CREATE TYPE priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE contact_status AS ENUM ('neu', 'in_bearbeitung', 'erledigt');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'danger', 'event');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');
```

5. Dann führen Sie die Tabellen-Erstellung aus (siehe `drizzle/schema.ts`)

### Methode 2: Mit Drizzle Push (empfohlen)

```bash
# Lokal ausführen mit Supabase DATABASE_URL
cd /home/ubuntu/buergerapp-schieder

# .env mit Supabase DATABASE_URL aktualisieren
echo "DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > .env

# Datenbank-Schema pushen
pnpm db:push
```

---

## 5️⃣ Automatisches Deployment testen

### Änderung vornehmen und pushen

```bash
cd /home/ubuntu/buergerapp-schieder

# Änderung machen (z.B. README bearbeiten)
echo "\n## Live auf Vercel! 🚀" >> README.md

# Commit und Push
git add .
git commit -m "Test: Automatisches Deployment"
git push origin main
```

### Deployment verfolgen

1. Gehen Sie zu Ihrem Vercel Dashboard
2. Sie sehen automatisch einen neuen Deployment-Prozess
3. Nach ca. 1-2 Minuten ist die Änderung live!

---

## 6️⃣ Custom Domain einrichten (optional)

### In Vercel:

1. Gehen Sie zu Ihrem Projekt → **Settings** → **Domains**
2. Klicken Sie auf "Add Domain"
3. Geben Sie Ihre Domain ein (z.B. `buergerapp-schieder.de`)
4. Folgen Sie den Anweisungen zur DNS-Konfiguration

### Bei Ihrem Domain-Anbieter:

Fügen Sie folgende DNS-Einträge hinzu:

**A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

⏱️ DNS-Propagierung dauert 5 Minuten bis 48 Stunden.

---

## 7️⃣ Workflow für Änderungen

Ab jetzt ist der Workflow super einfach:

```bash
# 1. Änderungen vornehmen
# Bearbeiten Sie Dateien in /home/ubuntu/buergerapp-schieder

# 2. Commit
git add .
git commit -m "Beschreibung der Änderung"

# 3. Push
git push origin main

# 4. Automatisches Deployment auf Vercel! ✨
```

**Das war's!** Vercel deployed automatisch jede Änderung auf `main`.

---

## 🔧 Nützliche Befehle

### Lokal entwickeln

```bash
# Development Server
pnpm dev

# Build testen
pnpm build

# Type-Checking
pnpm check
```

### Vercel CLI (optional)

```bash
# Vercel CLI installieren
npm i -g vercel

# Lokal mit Vercel-Umgebung testen
vercel dev

# Manuell deployen
vercel --prod
```

### Logs anzeigen

```bash
# Vercel Logs in Echtzeit
vercel logs --follow

# Oder im Vercel Dashboard → Projekt → Deployments → Logs
```

---

## 🐛 Troubleshooting

### Build schlägt fehl

**Problem**: "Module not found" oder ähnliche Fehler

**Lösung**:
1. Prüfen Sie `package.json` auf fehlende Dependencies
2. Führen Sie lokal `pnpm build` aus, um Fehler zu identifizieren
3. Prüfen Sie die Vercel Build Logs

### Datenbank-Verbindung schlägt fehl

**Problem**: "Connection refused" oder "Authentication failed"

**Lösung**:
1. Prüfen Sie `DATABASE_URL` in Vercel Environment Variables
2. Stellen Sie sicher, dass das Passwort korrekt ist
3. Prüfen Sie, ob Supabase-Projekt aktiv ist
4. Testen Sie die Verbindung lokal:
   ```bash
   psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

### Environment Variables werden nicht übernommen

**Problem**: Änderungen an Environment Variables haben keine Wirkung

**Lösung**:
1. Gehen Sie zu Vercel → Settings → Environment Variables
2. Ändern Sie die Variable
3. **Wichtig**: Triggern Sie ein neues Deployment:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

### Deployment dauert zu lange

**Problem**: Build hängt oder dauert > 10 Minuten

**Lösung**:
1. Prüfen Sie Vercel Build Logs auf Fehler
2. Canceln Sie das Deployment und versuchen Sie es erneut
3. Prüfen Sie, ob `pnpm-lock.yaml` committed ist

---

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Gehen Sie zu Ihrem Projekt → **Analytics**
2. Aktivieren Sie "Web Analytics" (kostenlos)
3. Sehen Sie Besucher, Performance und mehr

### Supabase Monitoring

1. Gehen Sie zu Ihrem Supabase Projekt → **Database**
2. Sehen Sie Verbindungen, Queries und Performance

---

## 🔒 Sicherheit

### Wichtige Sicherheitsmaßnahmen:

1. **Niemals** `.env` Dateien committen
2. **JWT_SECRET** sollte mindestens 32 Zeichen lang sein
3. **Supabase Row Level Security (RLS)** aktivieren:
   ```sql
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   -- Policies hinzufügen
   ```
4. **Vercel Environment Variables** sind verschlüsselt gespeichert
5. **HTTPS** ist automatisch aktiviert

---

## 💰 Kosten

### Free Tier Limits:

**Vercel (Hobby)**:
- ✅ 100 GB Bandwidth/Monat
- ✅ Unbegrenzte Deployments
- ✅ Automatisches HTTPS
- ✅ Custom Domains

**Supabase (Free)**:
- ✅ 500 MB Datenbank
- ✅ 1 GB File Storage
- ✅ 50.000 monatliche aktive Benutzer
- ✅ 2 GB Bandwidth

Für die meisten Städte ist der Free Tier ausreichend!

---

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues**: Erstellen Sie ein Issue im Repository

---

## ✅ Checkliste

- [ ] GitHub Repository erstellt
- [ ] Supabase Projekt erstellt
- [ ] DATABASE_URL kopiert
- [ ] Vercel Projekt erstellt
- [ ] Environment Variables gesetzt
- [ ] Erstes Deployment erfolgreich
- [ ] Datenbank initialisiert
- [ ] Automatisches Deployment getestet
- [ ] Custom Domain eingerichtet (optional)

---

**Herzlichen Glückwunsch! 🎉**

Ihre Bürger-App ist jetzt live und wird bei jedem Git Push automatisch aktualisiert!

