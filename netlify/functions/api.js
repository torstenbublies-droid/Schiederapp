const serverless = require('serverless-http');

// Import the Express app
let handler;

exports.handler = async (event, context) => {
  // Lazy load the server to avoid cold start issues
  if (!handler) {
    const app = await import('../../dist/index.js');
    handler = serverless(app.default || app);
  }
  
  return handler(event, context);
};

