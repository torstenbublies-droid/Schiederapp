import { load } from 'cheerio';
import { db } from '../db';
import { news } from '../../drizzle/schema';
import { nanoid } from 'nanoid';

const BEKANNTMACHUNGEN_URL = 'https://www.schieder-schwalenberg.de/Bürger-und-Service/Rathaus/Bekanntmachungen';

interface Bekanntmachung {
  title: string;
  date: string;
  teaser: string;
  sourceUrl: string;
}

export async function scrapeBekanntmachungen(): Promise<void> {
  try {
    console.log('🔄 Scraping Bekanntmachungen from Stadt Schieder-Schwalenberg...');
    
    const response = await fetch(BEKANNTMACHUNGEN_URL);
    const html = await response.text();
    const $ = load(html);
    
    const bekanntmachungen: Bekanntmachung[] = [];
    
    // Parse the announcements from the page
    // The structure shows announcements with title, date, and teaser
    $('div.bekanntmachung, div.mitteilung, article').each((i, elem) => {
      if (i >= 15) return false; // Limit to 15 items
      
      const $elem = $(elem);
      const title = $elem.find('h2, h3, .title, strong').first().text().trim();
      const dateText = $elem.find('.date, time, .datum').first().text().trim();
      const teaser = $elem.find('p, .teaser, .beschreibung').first().text().trim();
      const link = $elem.find('a').first().attr('href');
      
      if (title && dateText) {
        bekanntmachungen.push({
          title,
          date: parseDate(dateText),
          teaser: teaser || title,
          sourceUrl: link ? makeAbsoluteUrl(link) : BEKANNTMACHUNGEN_URL
        });
      }
    });
    
    // If the above structure doesn't work, try alternative parsing
    if (bekanntmachungen.length === 0) {
      // Look for date patterns and titles in the text
      const text = $('body').text();
      const datePattern = /(\d{2}\.\d{2}\.\d{4})/g;
      const matches = text.matchAll(datePattern);
      
      for (const match of matches) {
        if (bekanntmachungen.length >= 15) break;
        
        const dateStr = match[0];
        const index = match.index || 0;
        // Get text around the date
        const contextStart = Math.max(0, index - 200);
        const contextEnd = Math.min(text.length, index + 500);
        const context = text.substring(contextStart, contextEnd);
        
        // Try to extract title (usually before or after the date)
        const lines = context.split('\n').map(l => l.trim()).filter(l => l.length > 10);
        const title = lines.find(l => l.length > 20 && l.length < 200) || 'Bekanntmachung';
        
        bekanntmachungen.push({
          title,
          date: parseDate(dateStr),
          teaser: context.substring(0, 300).trim(),
          sourceUrl: BEKANNTMACHUNGEN_URL
        });
      }
    }
    
    console.log(`📊 Found ${bekanntmachungen.length} Bekanntmachungen`);
    
    // Store in database
    const database = await db();
    
    for (const item of bekanntmachungen) {
      try {
        await database.insert(news).values({
          id: `bekannt_${nanoid(12)}`,
          title: item.title,
          teaser: item.teaser,
          bodyMD: item.teaser,
          category: 'Bekanntmachungen',
          publishedAt: new Date(item.date),
          sourceUrl: item.sourceUrl,
          createdAt: new Date()
        }).onConflictDoNothing();
        
        console.log(`✅ Saved: ${item.title.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Error saving item: ${error}`);
      }
    }
    
    console.log('✅ Bekanntmachungen scraping completed');
    
  } catch (error) {
    console.error('❌ Error scraping Bekanntmachungen:', error);
    throw error;
  }
}

function parseDate(dateStr: string): string {
  // Parse German date format: DD.MM.YYYY
  const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }
  
  // Fallback to current date
  return new Date().toISOString().split('T')[0];
}

function makeAbsoluteUrl(url: string): string {
  if (url.startsWith('http')) {
    return url;
  }
  
  const baseUrl = 'https://www.schieder-schwalenberg.de';
  return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
}

// Run immediately if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeBekanntmachungen()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed:', error);
      process.exit(1);
    });
}

