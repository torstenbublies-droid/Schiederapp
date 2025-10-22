# Vercel Deployment Guide

## 🚀 Schnellstart

### 1. Vercel Account erstellen
1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Klicken Sie auf **"Sign Up"**
3. Wählen Sie **"Continue with GitHub"**
4. Autorisieren Sie Vercel für GitHub

### 2. Projekt importieren
1. Klicken Sie auf **"Add New..."** → **"Project"**
2. Wählen Sie **"Import Git Repository"**
3. Suchen Sie nach **`buergerapp-schieder`**
4. Klicken Sie auf **"Import"**

### 3. Environment Variables konfigurieren

Klicken Sie auf **"Environment Variables"** und fügen Sie hinzu:

#### Erforderlich:
```
DATABASE_URL=postgresql://postgres:Z7rqy4jq%2F%214@db.rutzddguyzpyxuphzxru.supabase.co:5432/postgres
```

#### Optional (aber empfohlen):
```
JWT_SECRET=buergerapp-schieder-jwt-secret-production-2025-secure-key
VITE_APP_ID=proj_buergerapp_schieder
VITE_APP_TITLE=Bürger-App Schieder-Schwalenberg
OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev
VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev
```

### 4. Deploy!
1. Klicken Sie auf **"Deploy"**
2. Warten Sie 2-3 Minuten
3. Ihre App ist live! 🎉

## 🔄 Automatisches Deployment

Nach dem ersten Deployment:
- **Jeder Git Push** → Automatisches Deployment
- **Pull Requests** → Preview-Deployments
- **Main Branch** → Production Deployment

## 📝 Bekanntmachungen scrapen

Nach dem Deployment können Sie Bekanntmachungen scrapen:

### Manuell:
Rufen Sie diese URL auf:
```
https://ihr-projekt.vercel.app/api/scrape-bekanntmachungen
```

### Automatisch (alle 3 Tage):
Verwenden Sie einen Cron-Service wie:
- **cron-job.org** (kostenlos)
- **EasyCron**
- **GitHub Actions**

Konfigurieren Sie einen Cron Job für:
```
0 6 */3 * *
```
(Alle 3 Tage um 6:00 Uhr)

URL: `https://ihr-projekt.vercel.app/api/scrape-bekanntmachungen`

## 🛠️ Troubleshooting

### Build schlägt fehl
- Prüfen Sie die Build-Logs in Vercel
- Stellen Sie sicher, dass alle Environment Variables gesetzt sind

### Datenbank-Verbindung schlägt fehl
- Prüfen Sie, ob `DATABASE_URL` korrekt ist
- Testen Sie die Verbindung in Supabase

### App lädt nicht
- Prüfen Sie die Function Logs in Vercel
- Öffnen Sie die Browser-Konsole (F12) für Fehler

## 📊 Vercel Dashboard

Nach dem Deployment finden Sie im Vercel Dashboard:
- **Deployments**: Alle Deployments und deren Status
- **Analytics**: Besucherstatistiken
- **Logs**: Function-Logs und Fehler
- **Settings**: Environment Variables, Domains, etc.

## 🌐 Custom Domain (optional)

1. Gehen Sie zu **Settings** → **Domains**
2. Klicken Sie auf **"Add"**
3. Geben Sie Ihre Domain ein
4. Folgen Sie den DNS-Anweisungen

## 💡 Tipps

- Vercel bietet **kostenloses Hosting** für Hobby-Projekte
- **Automatische HTTPS** für alle Domains
- **Edge Functions** für schnelle API-Antworten
- **Preview-Deployments** für jeden Pull Request

