import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { stadtWebsiteScraper } from "./services/stadtWebsiteScraper";
import { getKnowledgeBaseContext } from "./knowledge-base";

/**
 * Erkennt, ob eine Frage lokal (Schieder-Schwalenberg) oder global ist
 */
export function isLocalQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  
  // Lokale Keywords - wenn diese vorkommen, ist es eine lokale Frage
  const localKeywords = [
    'schieder', 'schwalenberg', 'rathaus', 'bürgermeister', 'stadt',
    'öffnungszeiten', 'veranstaltung', 'event', 'termin',
    'müll', 'abfall', 'störung', 'notfall', 'warnung',
    'badeanstalt', 'schwimmbad', 'freibad', 'bibliothek', 'kita', 'schule',
    'amt', 'behörde', 'verwaltung', 'bürgerbüro',
    'mängelmelder', 'schadensmeldung',
    'hier', 'bei uns', 'in der stadt', 'marco', 'müllers'
  ];
  
  // Globale Keywords - wenn diese vorkommen UND keine lokalen Keywords, ist es eine globale Frage
  const globalKeywords = [
    'bundeskanzler', 'bundesregierung', 'deutschland',
    'politiker', 'politik', 'partei',
    'welt', 'europa', 'land', 'staat',
    'geschichte', 'wissenschaft', 'technik',
    'wie hoch', 'wie groß', 'wie alt', 'wann wurde', 'wo liegt',
    'was ist', 'wer ist', 'wer war'
  ];
  
  // Prüfe auf lokale Keywords
  const hasLocalKeyword = localKeywords.some(keyword => lowerQuery.includes(keyword));
  
  // Prüfe auf globale Keywords
  const hasGlobalKeyword = globalKeywords.some(keyword => lowerQuery.includes(keyword));
  
  // Wenn lokale Keywords vorhanden sind, ist es eine lokale Frage
  if (hasLocalKeyword) {
    return true;
  }
  
  // Wenn globale Keywords vorhanden sind und keine lokalen, ist es eine globale Frage
  if (hasGlobalKeyword && !hasLocalKeyword) {
    return false;
  }
  
  // Standardmäßig als lokal behandeln (Sicherheit)
  return true;
}

/**
 * Erweiterte RAG-Funktion: Durchsucht die Datenbank nach relevanten Informationen
 * basierend auf der Benutzeranfrage
 */
export async function searchLocalContext(query: string) {
  const lowerQuery = query.toLowerCase();
  
  // Keyword-basierte Suche für verschiedene Bereiche
  const results: any = {
    news: [],
    events: [],
    services: [],
    departments: [],
    mayor: null,
    alerts: [],
    waste: [],
    stadtWebsite: {
      mitteilungen: [],
      veranstaltungen: [],
    },
  };

  // Suche nach relevanten Bereichen basierend auf Keywords (mit Fehlerbehandlung)
  try {
    if (lowerQuery.includes('news') || lowerQuery.includes('nachricht') || lowerQuery.includes('aktuell')) {
      results.news = await db.getAllNews(10);
    }
  } catch (error) {
    console.log('[Chat] Datenbank nicht erreichbar für News, verwende Stadt-Website-Daten');
  }

  try {
    if (lowerQuery.includes('veranstaltung') || lowerQuery.includes('event') || lowerQuery.includes('termin') || lowerQuery.includes('heute') || lowerQuery.includes('morgen')) {
      results.events = await db.getUpcomingEvents(10);
    }
  } catch (error) {
    console.log('[Chat] Datenbank nicht erreichbar für Events, verwende Stadt-Website-Daten');
  }

  try {
    if (lowerQuery.includes('bürgermeister') || lowerQuery.includes('mayor')) {
      results.mayor = await db.getMayorInfo();
    }
  } catch (error) {
    console.log('[Chat] Datenbank nicht erreichbar für Bürgermeister-Info');
  }

  try {
    if (lowerQuery.includes('störung') || lowerQuery.includes('notfall') || lowerQuery.includes('warnung') || lowerQuery.includes('alert')) {
      results.alerts = await db.getActiveAlerts();
    }
  } catch (error) {
    console.log('[Chat] Datenbank nicht erreichbar für Alerts');
  }

  // Müll-Termine werden über die waste Router abgerufen

  // Hole aktuelle Informationen von der Stadt-Website
  try {
    const [mitteilungen, veranstaltungen] = await Promise.all([
      stadtWebsiteScraper.getMitteilungen(),
      stadtWebsiteScraper.getVeranstaltungen(),
    ]);
    results.stadtWebsite.mitteilungen = mitteilungen.slice(0, 5);
    results.stadtWebsite.veranstaltungen = veranstaltungen.slice(0, 5);
  } catch (error) {
    console.error('Fehler beim Abrufen der Stadt-Website-Daten:', error);
  }

  // Immer Basis-Kontext laden (mit Fehlerbehandlung)
  if (!results.news.length && !results.events.length && !results.mayor && !results.alerts.length) {
    try {
      // Lade Standard-Kontext
      const [news, events, mayor, alerts] = await Promise.all([
        db.getAllNews(3).catch(() => []),
        db.getUpcomingEvents(3).catch(() => []),
        db.getMayorInfo().catch(() => null),
        db.getActiveAlerts().catch(() => []),
      ]);
      results.news = news;
      results.events = events;
      results.mayor = mayor;
      results.alerts = alerts;
    } catch (error) {
      console.log('[Chat] Datenbank nicht erreichbar, verwende nur Stadt-Website-Daten');
    }
  }

  return results;
}

/**
 * Formatiert den Kontext für das System-Prompt
 */
export function formatContextForPrompt(context: any): string {
  let formatted = '';

  if (context.news && context.news.length > 0) {
    formatted += '\n**AKTUELLE NACHRICHTEN:**\n';
    context.news.forEach((n: any) => {
      formatted += `- ${n.title} (${n.category || 'Allgemein'}, ${new Date(n.publishedAt).toLocaleDateString('de-DE')})\n`;
      if (n.summary) formatted += `  ${n.summary}\n`;
    });
  }

  if (context.events && context.events.length > 0) {
    formatted += '\n**KOMMENDE VERANSTALTUNGEN:**\n';
    context.events.forEach((e: any) => {
      formatted += `- ${e.title} am ${new Date(e.startDate).toLocaleDateString('de-DE')}`;
      if (e.location) formatted += ` in ${e.location}`;
      formatted += '\n';
      if (e.description) formatted += `  ${e.description}\n`;
    });
  }

  if (context.mayor) {
    formatted += '\n**BÜRGERMEISTER:**\n';
    formatted += `- Name: ${context.mayor.name}\n`;
    formatted += `- E-Mail: ${context.mayor.email || 'N/A'}\n`;
    formatted += `- Telefon: ${context.mayor.phone || 'N/A'}\n`;
  }

  if (context.alerts && context.alerts.length > 0) {
    formatted += '\n**AKTUELLE STÖRUNGEN/WARNUNGEN:**\n';
    context.alerts.forEach((a: any) => {
      formatted += `- ${a.title} (${a.category}, Priorität: ${a.priority})\n`;
      if (a.message) formatted += `  ${a.message}\n`;
    });
  } else {
    formatted += '\n**AKTUELLE STÖRUNGEN/WARNUNGEN:**\nKeine aktuellen Störungen\n';
  }

  // Abfalltermine werden bei Bedarf separat abgerufen

  // Stadt-Website Informationen
  if (context.stadtWebsite) {
    if (context.stadtWebsite.mitteilungen && context.stadtWebsite.mitteilungen.length > 0) {
      formatted += '\n**OFFIZIELLE MITTEILUNGEN VON SCHIEDER-SCHWALENBERG.DE:**\n';
      context.stadtWebsite.mitteilungen.forEach((m: any) => {
        formatted += `- ${m.title}`;
        if (m.date) formatted += ` (${m.date})`;
        formatted += '\n';
        if (m.content) formatted += `  ${m.content.substring(0, 200)}...\n`;
        if (m.url) formatted += `  Link: ${m.url}\n`;
      });
    }

    if (context.stadtWebsite.veranstaltungen && context.stadtWebsite.veranstaltungen.length > 0) {
      formatted += '\n**VERANSTALTUNGEN VON SCHIEDER-SCHWALENBERG.DE:**\n';
      context.stadtWebsite.veranstaltungen.forEach((v: any) => {
        formatted += `- ${v.title}`;
        if (v.date) formatted += ` (${v.date})`;
        formatted += '\n';
        if (v.content) formatted += `  ${v.content.substring(0, 150)}...\n`;
      });
    }
  }

  return formatted;
}

/**
 * Generiert Deep-Links zu relevanten App-Bereichen
 */
export function generateDeepLinks(query: string): string {
  const lowerQuery = query.toLowerCase();
  const links: string[] = [];

  if (lowerQuery.includes('veranstaltung') || lowerQuery.includes('event')) {
    links.push('📅 Alle Veranstaltungen anzeigen: /events');
  }

  if (lowerQuery.includes('news') || lowerQuery.includes('nachricht') || lowerQuery.includes('aktuell')) {
    links.push('📰 Alle Nachrichten anzeigen: /news');
  }

  if (lowerQuery.includes('müll') || lowerQuery.includes('abfall')) {
    links.push('🗑️ Abfallkalender: /waste');
  }

  if (lowerQuery.includes('mängel') || lowerQuery.includes('schaden')) {
    links.push('🔧 Mängelmelder: /issue-reports');
  }

  if (lowerQuery.includes('kontakt') || lowerQuery.includes('anliegen')) {
    links.push('📞 Kontakt & Anliegen: /contact');
  }

  if (links.length > 0) {
    return '\n\n' + links.join('\n');
  }

  return '';
}

/**
 * Erstellt das optimierte System-Prompt für LOKALE Fragen
 */
export function createLocalSystemPrompt(contextData: string): string {
  // Hole die Wissensdatenbank
  const knowledgeBase = getKnowledgeBaseContext();
  
  return `Du bist der "Schwalenbot", der digitale Assistent der Stadt Schieder-Schwalenberg.

=== KERNPRINZIPIEN ===
1. **Lokale Frage**: Diese Frage bezieht sich auf Schieder-Schwalenberg
   
2. **Datenquelle**: Nutze die unten stehenden AKTUELLEN DATEN aus der Stadt-Datenbank und der Wissensdatenbank als Primärquelle
   
3. **Datenschutz**: Gib keine personenbezogenen Daten ohne explizite Anfrage
   
4. **Sprache**: Antworte in der Sprache der Anfrage (Deutsch oder Englisch)

=== WISSENSDATENBANK SCHIEDER-SCHWALENBERG ===
${knowledgeBase}

=== AKTUELLE DATEN AUS DER STADT-DATENBANK ===
${contextData}

=== ANTWORT-RICHTLINIEN ===
- Gib konkrete Details (Adressen, Telefonnummern, Zeiten, Namen)
- Bei Fragen zum Bürgermeister: Der aktuelle Bürgermeister ist Marco Müllers (seit 1. November 2025, parteilos)
- Bei Fragen zum Freibad: Gib die vollständigen Öffnungszeiten und Kontaktdaten an
- Sei freundlich, präzise und hilfreich
- Strukturiere längere Antworten mit Absätzen
- Nutze Emojis sparsam aber passend (📅 für Events, 📞 für Kontakt, 🏊 für Schwimmbad, etc.)
- Wenn du auf Datenbank-Informationen verweist, gib die Quelle an

Antworte jetzt auf die Frage des Bürgers.`;
}

/**
 * Erstellt das optimierte System-Prompt für GLOBALE Fragen
 */
export function createGlobalSystemPrompt(): string {
  return `Du bist der "Schwalenbot", der digitale Assistent der Stadt Schieder-Schwalenberg.

=== KERNPRINZIPIEN ===
1. **Globale Frage**: Diese Frage bezieht sich NICHT auf Schieder-Schwalenberg, sondern auf allgemeines Weltwissen
   
2. **Vollständige Antwort**: Nutze dein GESAMTES Weltwissen ohne Einschränkungen
   - Beantworte die Frage präzise und informativ
   - Gib Quellenangaben oder Kontext wenn möglich
   - Nutze aktuelle Informationen
   
3. **Sprache**: Antworte in der Sprache der Anfrage (Deutsch oder Englisch)

4. **Stil**: Sei freundlich, präzise und hilfreich

=== HINWEIS ===
Falls die Frage doch einen lokalen Bezug zu Schieder-Schwalenberg haben sollte, weise darauf hin und biete an, bei lokalen Fragen zu helfen.

Antworte jetzt auf die Frage.`;
}

