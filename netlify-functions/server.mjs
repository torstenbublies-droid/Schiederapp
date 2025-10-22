import express from 'express';
import serverless from 'serverless-http';
import { eq, desc } from 'drizzle-orm';

// Import database
let db, getDb;

async function initDb() {
  if (!db) {
    const dbModule = await import('../server/db.js');
    db = dbModule.db;
    getDb = dbModule.getDb;
  }
}

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// News API
app.get('/api/news', async (req, res) => {
  try {
    await initDb();
    const database = await getDb();
    if (!database) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const { category } = req.query;
    const { news } = db;
    
    let query = database.select().from(news);
    
    if (category) {
      query = query.where(eq(news.category, category));
    }
    
    const results = await query.orderBy(desc(news.publishedAt)).limit(50);
    res.json(results);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news', message: error.message });
  }
});

// Events API
app.get('/api/events', async (req, res) => {
  try {
    await initDb();
    const database = await getDb();
    if (!database) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const { events } = db;
    const results = await database.select().from(events)
      .orderBy(desc(events.startDate))
      .limit(50);
    res.json(results);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events', message: error.message });
  }
});

// Departments API
app.get('/api/departments', async (req, res) => {
  try {
    await initDb();
    const database = await getDb();
    if (!database) {
      return res.status(500).json({ error: 'Database not available' });
    }
    
    const { departments } = db;
    const results = await database.select().from(departments);
    res.json(results);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments', message: error.message });
  }
});

// Scraper endpoints
app.get('/api/scrape-bekanntmachungen', async (req, res) => {
  try {
    const { scrapeBekanntmachungen } = await import('../server/scrapers/bekanntmachungen.js');
    const result = await scrapeBekanntmachungen();
    res.json(result);
  } catch (error) {
    console.error('Error scraping:', error);
    res.status(500).json({ error: 'Failed to scrape bekanntmachungen', message: error.message });
  }
});

app.get('/api/scrape-veranstaltungen', async (req, res) => {
  try {
    const { scrapeVeranstaltungen } = await import('../server/scrapers/veranstaltungen.js');
    const result = await scrapeVeranstaltungen();
    res.json(result);
  } catch (error) {
    console.error('Error scraping events:', error);
    res.status(500).json({ error: 'Failed to scrape veranstaltungen', message: error.message });
  }
});

// Catch all
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

export const handler = serverless(app);
