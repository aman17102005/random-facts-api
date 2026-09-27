const ApiError = require('../utils/ApiError');

/**
 * Catches any request that didn't match a route.
 */
function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} does not exist.`));
}

/**
 * Central error handler. Every thrown/next(err) error ends up here,
 * so all error responses share one consistent JSON shape:
 *   { "error": { "status": <code>, "message": <string>, "details"?: <any> } }
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Something went wrong on our end.'
      : err.message || 'Unexpected error.';

  const body = { error: { status, message } };

  if (err.details) {
    body.error.details = err.details;
  }

  if (status === 500) {
    // Log full detail server-side even if we hide it from the client.
    console.error('[UNHANDLED ERROR]', err);
  }

  res.status(status).json(body);
}

module.exports = { notFoundHandler, errorHandler };
