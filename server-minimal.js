// Minimal test server for Railway debugging
import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Minimal server is running',
    port: PORT,
    env: process.env.NODE_ENV || 'not set'
  });
});

app.get('/', (req, res) => {
  res.send('<h1>Railway Test Server</h1><p>Server is running correctly!</p>');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Minimal server running on http://0.0.0.0:${PORT}/`);
  console.log(`PORT: ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

