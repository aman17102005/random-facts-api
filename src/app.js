const express = require('express');
const cors = require('cors');

const factRoutes = require('./routes/factRoutes');
const rateLimiter = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const factService = require('./services/factService');

const app = express();

// --- Core middleware ---
app.use(express.json());

const corsOrigin = process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*'
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : '*';
app.use(cors({ origin: corsOrigin }));

app.use(rateLimiter);

// --- Root: quick welcome + pointer to docs, so the base URL is useful ---
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Random Facts API',
    description: 'A free, public API for random, interesting, verified facts.',
    version: '1.0.0',
    factCount: factService.getFactCount(),
    endpoints: {
      randomFact: 'GET /api/fact',
      randomFactByCategory: 'GET /api/fact?category=space',
      multipleFacts: 'GET /api/facts?limit=10',
      categories: 'GET /api/categories',
      factOfTheDay: 'GET /api/fact/today',
      health: 'GET /health',
    },
    documentation: 'See README.md in the project repository for full docs.',
  });
});

// --- Health check (useful for uptime monitors / hosting platforms) ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptimeSeconds: process.uptime() });
});

// --- API routes ---
app.use('/api', factRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
