import { ENV } from "./_core/env";

/**
 * Perplexity Search API Integration
 * Provides high-quality web search results for local and global queries
 */

interface PerplexitySearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface PerplexitySearchResponse {
  results: PerplexitySearchResult[];
}

/**
 * Fügt lokalen Kontext zu einer Suchanfrage hinzu
 */
function addLocalContext(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Keywords die auf lokale Fragen hinweisen
  const localIndicators = [
    'apotheke', 'arzt', 'ärztin', 'krankenhaus', 'klinik',
    'restaurant', 'café', 'essen', 'trinken',
    'hotel', 'übernachten', 'unterkunft',
    'geschäft', 'laden', 'einkaufen', 'supermarkt',
    'bank', 'sparkasse', 'geldautomat',
    'tankstelle', 'werkstatt',
    'friseur', 'frisör', 'friseurin',
    'bäckerei', 'metzgerei', 'fleischerei',
    'schule', 'kindergarten', 'kita',
    'spielplatz', 'park',
    'schwimmbad', 'freibad', 'hallenbad', 'badeanstalt',
    'bücherei', 'bibliothek',
    'kirche', 'friedhof',
    'polizei', 'feuerwehr',
    'post', 'paket',
    'busfahrplan', 'bus', 'haltestelle',
    'öffnungszeiten', 'geöffnet', 'geschlossen',
    'wo ist', 'wo finde', 'wo gibt es',
    'nächste', 'nächster', 'nächstes',
    'hier', 'in der nähe', 'bei uns',
    'veranstaltung', 'event', 'konzert', 'festival',
    'weihnachtsmarkt', 'adventsmarkt', 'markt',
    'was ist los', 'was kann man'
  ];
  
  // Prüfe ob die Anfrage lokalen Bezug hat
  const hasLocalIndicator = localIndicators.some(indicator => 
    lowerQuery.includes(indicator)
  );
  
  // Wenn lokaler Bezug erkannt wird, füge "in Schieder-Schwalenberg" hinzu
  if (hasLocalIndicator && !lowerQuery.includes('schieder') && !lowerQuery.includes('schwalenberg')) {
    return `${query} in Schieder-Schwalenberg`;
  }
  
  return query;
}

/**
 * Suche mit Perplexity Search API
 */
export async function performPerplexitySearch(query: string): Promise<string> {
  try {
    // Prüfe ob API Key vorhanden ist
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error('[Perplexity] API Key not found');
      return '';
    }
    
    // Füge lokalen Kontext hinzu wenn nötig
    const enhancedQuery = addLocalContext(query);
    
    console.log(`[Perplexity Search] Original: "${query}" → Enhanced: "${enhancedQuery}"`);
    
    // Rufe Perplexity Search API auf
    const response = await fetch('https://api.perplexity.ai/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: [enhancedQuery],
      }),
    });
    
    if (!response.ok) {
      console.error('[Perplexity] Search failed:', response.statusText);
      return '';
    }
    
    const data: PerplexitySearchResponse = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log('[Perplexity] No results found');
      return '';
    }
    
    // Formatiere Ergebnisse
    const formattedResults = data.results
      .slice(0, 5) // Top 5 Ergebnisse
      .map(result => {
        let formatted = `**${result.title}**\n`;
        if (result.snippet) {
          formatted += `${result.snippet}\n`;
        }
        if (result.url) {
          formatted += `Quelle: ${result.url}\n`;
        }
        return formatted;
      })
      .join('\n');
    
    console.log(`[Perplexity] Found ${data.results.length} results`);
    return formattedResults;
    
  } catch (error) {
    console.error('[Perplexity] Search error:', error);
    return '';
  }
}

/**
 * Suche mit Perplexity Grounded LLM (sonar)
 * Kombiniert Suche + LLM für bessere Antworten
 */
export async function performPerplexitySonar(query: string): Promise<string> {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error('[Perplexity Sonar] API Key not found');
      return '';
    }
    
    const enhancedQuery = addLocalContext(query);
    
    console.log(`[Perplexity Sonar] Query: "${enhancedQuery}"`);
    
    // Rufe Perplexity Sonar (Grounded LLM) auf
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein hilfreicher Assistent. Beantworte Fragen präzise und mit Quellenangaben.',
          },
          {
            role: 'user',
            content: enhancedQuery,
          },
        ],
      }),
    });
    
    if (!response.ok) {
      console.error('[Perplexity Sonar] Request failed:', response.statusText);
      return '';
    }
    
    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const answer = data.choices[0].message.content;
      console.log(`[Perplexity Sonar] Got answer (${answer.length} chars)`);
      return answer;
    }
    
    return '';
    
  } catch (error) {
    console.error('[Perplexity Sonar] Error:', error);
    return '';
  }
}
