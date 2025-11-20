/**
 * Google Places API Integration
 * Für Umkreissuche nach Restaurants, Geschäften, Apotheken, etc.
 */

// Koordinaten für Schieder-Schwalenberg (Zentrum)
const SCHIEDER_LAT = 51.8667;
const SCHIEDER_LNG = 9.1833;
const DEFAULT_RADIUS = 5000; // 5km Radius

// Google Places API Key
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

/**
 * Kategorien-Mapping: Deutsche Begriffe → Google Places Types
 */
const CATEGORY_MAPPING: Record<string, string[]> = {
  // Gastronomie
  'restaurant': ['restaurant'],
  'restaurants': ['restaurant'],
  'essen': ['restaurant'],
  'café': ['cafe'],
  'cafés': ['cafe'],
  'kaffee': ['cafe'],
  'bar': ['bar'],
  'bars': ['bar'],
  'kneipe': ['bar'],
  'pizza': ['restaurant', 'meal_delivery'],
  'burger': ['restaurant'],
  'döner': ['restaurant'],
  'imbiss': ['restaurant', 'meal_takeaway'],
  
  // Einkaufen
  'supermarkt': ['supermarket'],
  'supermärkte': ['supermarket'],
  'einkaufen': ['supermarket', 'shopping_mall'],
  'geschäft': ['store'],
  'geschäfte': ['store'],
  'laden': ['store'],
  'bäckerei': ['bakery'],
  'bäcker': ['bakery'],
  'metzger': ['store'],
  'fleischer': ['store'],
  
  // Gesundheit
  'apotheke': ['pharmacy'],
  'apotheken': ['pharmacy'],
  'arzt': ['doctor'],
  'ärzte': ['doctor'],
  'zahnarzt': ['dentist'],
  'zahnärzte': ['dentist'],
  'krankenhaus': ['hospital'],
  'klinik': ['hospital'],
  
  // Auto & Verkehr
  'tankstelle': ['gas_station'],
  'tankstellen': ['gas_station'],
  'tanken': ['gas_station'],
  'werkstatt': ['car_repair'],
  'autowerkstatt': ['car_repair'],
  'parkplatz': ['parking'],
  'parken': ['parking'],
  
  // Unterkunft
  'hotel': ['lodging'],
  'hotels': ['lodging'],
  'unterkunft': ['lodging'],
  'pension': ['lodging'],
  'ferienwohnung': ['lodging'],
  
  // Freizeit
  'kino': ['movie_theater'],
  'museum': ['museum'],
  'park': ['park'],
  'spielplatz': ['park'],
  'schwimmbad': ['swimming_pool'],
  'fitness': ['gym'],
  'fitnessstudio': ['gym'],
  
  // Sonstiges
  'bank': ['bank'],
  'banken': ['bank'],
  'geldautomat': ['atm'],
  'post': ['post_office'],
  'friseur': ['hair_care'],
  'frisör': ['hair_care'],
};

/**
 * Erkennt, ob eine Frage eine Umkreissuche ist
 */
export function isProximityQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  
  // Proximity-Keywords
  const proximityKeywords = [
    'in der nähe', 'nähe', 'umgebung', 'umkreis',
    'hier', 'bei mir', 'in schieder',
    'wo finde ich', 'wo gibt es', 'gibt es',
    'wo kann ich', 'suche', 'wo ist',
    'nächste', 'nächster', 'nächstes',
    'zeige mir', 'liste'
  ];
  
  // Prüfe auf Proximity-Keywords
  const hasProximityKeyword = proximityKeywords.some(keyword => lowerQuery.includes(keyword));
  
  // Prüfe auf Kategorien
  const hasCategory = Object.keys(CATEGORY_MAPPING).some(category => 
    lowerQuery.includes(category)
  );
  
  return hasProximityKeyword && hasCategory;
}

/**
 * Extrahiert die Kategorie aus der Anfrage
 */
function extractCategory(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  
  for (const [keyword, types] of Object.entries(CATEGORY_MAPPING)) {
    if (lowerQuery.includes(keyword)) {
      return types;
    }
  }
  
  // Fallback: generische Suche
  return ['establishment'];
}

/**
 * Sucht Orte in der Nähe mit Google Places API
 */
export async function searchNearbyPlaces(query: string, radius: number = DEFAULT_RADIUS) {
  if (!GOOGLE_PLACES_API_KEY) {
    console.error('[Google Places] API Key nicht konfiguriert');
    return null;
  }
  
  try {
    // Extrahiere Kategorie
    const types = extractCategory(query);
    const type = types[0]; // Nutze ersten Type
    
    console.log(`[Google Places] Suche nach "${type}" im Umkreis von ${radius}m`);
    
    // Google Places Nearby Search API
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.append('location', `${SCHIEDER_LAT},${SCHIEDER_LNG}`);
    url.searchParams.append('radius', radius.toString());
    url.searchParams.append('type', type);
    url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
    url.searchParams.append('language', 'de');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('[Google Places] API request failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('[Google Places] API error:', data.status, data.error_message);
      return null;
    }
    
    if (data.status === 'ZERO_RESULTS') {
      console.log('[Google Places] Keine Ergebnisse gefunden');
      return {
        results: [],
        query: query,
        category: type,
      };
    }
    
    // Formatiere Ergebnisse
    const results = data.results.slice(0, 10).map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      rating: place.rating || null,
      userRatingsTotal: place.user_ratings_total || 0,
      openNow: place.opening_hours?.open_now || null,
      types: place.types,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      placeId: place.place_id,
    }));
    
    console.log(`[Google Places] ${results.length} Ergebnisse gefunden`);
    
    return {
      results,
      query,
      category: type,
      totalResults: data.results.length,
    };
  } catch (error) {
    console.error('[Google Places] Error:', error);
    return null;
  }
}

/**
 * Holt Details zu einem bestimmten Ort
 */
export async function getPlaceDetails(placeId: string) {
  if (!GOOGLE_PLACES_API_KEY) {
    console.error('[Google Places] API Key nicht konfiguriert');
    return null;
  }
  
  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.append('place_id', placeId);
    url.searchParams.append('fields', 'name,formatted_address,formatted_phone_number,opening_hours,website,rating,user_ratings_total,reviews');
    url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
    url.searchParams.append('language', 'de');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('[Google Places] Details request failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('[Google Places] Details error:', data.status);
      return null;
    }
    
    return data.result;
  } catch (error) {
    console.error('[Google Places] Details error:', error);
    return null;
  }
}

/**
 * Formatiert Places-Ergebnisse für das LLM
 */
export function formatPlacesForPrompt(placesData: any): string {
  if (!placesData || !placesData.results || placesData.results.length === 0) {
    return '\n(Keine Orte in der Nähe gefunden)\n';
  }
  
  let formatted = `\n**ORTE IN DER NÄHE (Google Places):**\n`;
  formatted += `Kategorie: ${placesData.category}\n`;
  formatted += `Gefunden: ${placesData.results.length} Orte\n\n`;
  
  placesData.results.forEach((place: any, index: number) => {
    formatted += `${index + 1}. **${place.name}**\n`;
    formatted += `   📍 Adresse: ${place.address}\n`;
    
    if (place.rating) {
      formatted += `   ⭐ Bewertung: ${place.rating}/5 (${place.userRatingsTotal} Bewertungen)\n`;
    }
    
    if (place.openNow !== null) {
      formatted += `   🕐 ${place.openNow ? 'Jetzt geöffnet' : 'Jetzt geschlossen'}\n`;
    }
    
    formatted += '\n';
  });
  
  return formatted;
}
