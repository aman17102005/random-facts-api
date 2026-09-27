/**
 * Lightweight custom error class so route handlers can throw a single,
 * consistent error type that the central error handler knows how to
 * translate into a proper HTTP status code and JSON body.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }

  static notFound(message, details) {
    return new ApiError(404, message, details);
  }
}

module.exports = ApiError;
