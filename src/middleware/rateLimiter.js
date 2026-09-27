const rateLimit = require('express-rate-limit');

const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 1;
const maxRequests = Number(process.env.RATE_LIMIT_MAX) || 60;

/**
 * Basic per-IP rate limiting suitable for a small free public API.
 * Tune via RATE_LIMIT_MAX / RATE_LIMIT_WINDOW_MINUTES env vars.
 */
const rateLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  standardHeaders: true, // adds RateLimit-* headers
  legacyHeaders: false,
  message: {
    error: {
      status: 429,
      message: `Too many requests. Limit is ${maxRequests} requests per ${windowMinutes} minute(s). Please slow down and try again shortly.`,
    },
  },
});

module.exports = rateLimiter;
