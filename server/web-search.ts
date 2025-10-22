import { ENV } from './_core/env';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Performs a web search using the built-in data API
 */
export async function performWebSearch(query: string): Promise<string> {
  try {
    const response = await fetch(`${ENV.forgeApiUrl}/v1/data/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ENV.forgeApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queries: [query],
        type: 'info',
      }),
    });

    if (!response.ok) {
      console.error('Web search failed:', response.statusText);
      return '';
    }

    const data = await response.json();
    
    // Extract relevant information from search results
    if (data.results && data.results.length > 0) {
      const topResults = data.results.slice(0, 3);
      return topResults
        .map((r: SearchResult) => `${r.title}: ${r.snippet}`)
        .join('\n\n');
    }

    return '';
  } catch (error) {
    console.error('Web search error:', error);
    return '';
  }
}

/**
 * Determines if a query requires web search (general knowledge)
 * or can be answered with local data
 */
export function requiresWebSearch(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  // Keywords that indicate general/global questions
  const globalKeywords = [
    'bundeskanzler',
    'bundesregierung',
    'deutschland',
    'europa',
    'welt',
    'aktuell',
    'nachrichten',
    'wetter',
    'politik',
    'wirtschaft',
    'sport',
    'wissenschaft',
  ];
  
  // Keywords that indicate local questions
  const localKeywords = [
    'schieder',
    'schwalenberg',
    'rathaus',
    'bürgermeister',
    'öffnungszeiten',
    'veranstaltung',
    'termin',
    'mängelmelder',
    'abfall',
    'müll',
  ];
  
  // Check if message contains local keywords
  const hasLocalKeyword = localKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // If local keyword found, don't search web
  if (hasLocalKeyword) {
    return false;
  }
  
  // Check if message contains global keywords
  const hasGlobalKeyword = globalKeywords.some(keyword => lowerMessage.includes(keyword));
  
  return hasGlobalKeyword;
}

