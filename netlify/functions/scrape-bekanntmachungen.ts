import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { load } from 'cheerio';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { news } from '../../drizzle/schema';
import { nanoid } from 'nanoid';

const BEKANNTMACHUNGEN_URL = 'https://www.schieder-schwalenberg.de/Bürger-und-Service/Rathaus/Bekanntmachungen';

interface Bekanntmachung {
  title: string;
  date: string;
  teaser: string;
  sourceUrl: string;
}

async function scrapeBekanntmachungen() {
  console.log('🔄 Scraping Bekanntmachungen...');
  
  const response = await fetch(BEKANNTMACHUNGEN_URL);
  const html = await response.text();
  const $ = load(html);
  
  const bekanntmachungen: Bekanntmachung[] = [];
  
  // Extract announcements from the page
  const pageText = $('body').text();
  const dateRegex = /(\d{2}\.\d{2}\.\d{4})/g;
  const lines = pageText.split('\n').map(l => l.trim()).filter(l => l);
  
  for (let i = 0; i < lines.length && bekanntmachungen.length < 15; i++) {
    const line = lines[i];
    const dateMatch = line.match(dateRegex);
    
    if (dateMatch && dateMatch[0]) {
      const date = dateMatch[0];
      let title = '';
      let teaser = '';
      
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nextLine = lines[j].trim();
        if (nextLine.length < 10) continue;
        if (nextLine.match(/^\d{2}\.\d{2}\.\d{4}$/)) break;
        if (nextLine.match(/^(Mehr|mehr|Textanriss|überspringen|Seite:)$/)) continue;
        
        if (!title && nextLine.length > 15 && nextLine.length < 300) {
          title = nextLine.replace(/Mehr$/, '').replace(/\s+/g, ' ').trim();
          
          for (let k = j + 1; k < Math.min(j + 3, lines.length); k++) {
            const teaserLine = lines[k].trim();
            if (teaserLine.length > 20 && teaserLine.length < 500 && !teaserLine.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
              teaser = teaserLine.replace(/Mehr$/, '').replace(/\s+/g, ' ').trim();
              break;
            }
          }
          break;
        }
      }
      
      if (title && title.length > 10) {
        bekanntmachungen.push({
          title: title.substring(0, 400),
          date: parseDate(date),
          teaser: teaser ? teaser.substring(0, 400) : title.substring(0, 200),
          sourceUrl: BEKANNTMACHUNGEN_URL
        });
      }
    }
  }
  
  // Remove duplicates
  const uniqueBekanntmachungen = bekanntmachungen.filter((item, index, self) =>
    index === self.findIndex((t) => t.title === item.title)
  );
  
  console.log(`📊 Found ${uniqueBekanntmachungen.length} unique Bekanntmachungen`);
  
  // Store in database
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not configured');
  }
  
  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);
  
  let savedCount = 0;
  for (const item of uniqueBekanntmachungen) {
    try {
      await db.insert(news).values({
        id: `bekannt_${nanoid(12)}`,
        title: item.title,
        teaser: item.teaser,
        bodyMD: item.teaser,
        category: 'Bekanntmachungen',
        publishedAt: new Date(item.date),
        sourceUrl: item.sourceUrl,
        createdAt: new Date()
      }).onConflictDoNothing();
      
      savedCount++;
      console.log(`✅ Saved: ${item.title.substring(0, 60)}...`);
    } catch (error) {
      console.error(`❌ Error saving: ${error}`);
    }
  }
  
  await client.end();
  
  return {
    found: uniqueBekanntmachungen.length,
    saved: savedCount
  };
}

function parseDate(dateStr: string): string {
  const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split('T')[0];
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const result = await scrapeBekanntmachungen();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Scraped ${result.found} Bekanntmachungen, saved ${result.saved}`,
        ...result
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

