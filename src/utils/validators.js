const MIN_LIMIT = 1;
const MAX_LIMIT = 50;

/**
 * Validates a `limit` query param.
 * Returns { valid: true, value } or { valid: false, message }.
 */
function validateLimit(rawLimit) {
  if (rawLimit === undefined) {
    return { valid: true, value: 5 }; // sensible default
  }

  const value = Number(rawLimit);

  if (!Number.isInteger(value)) {
    return {
      valid: false,
      message: `"limit" must be a whole number between ${MIN_LIMIT} and ${MAX_LIMIT}.`,
    };
  }

  if (value < MIN_LIMIT || value > MAX_LIMIT) {
    return {
      valid: false,
      message: `"limit" must be between ${MIN_LIMIT} and ${MAX_LIMIT}.`,
    };
  }

  return { valid: true, value };
}

/**
 * Validates a `category` query param against the known list of categories.
 */
function validateCategory(rawCategory, knownCategories) {
  if (rawCategory === undefined) {
    return { valid: true, value: undefined };
  }

  const value = String(rawCategory).trim().toLowerCase();

  if (value.length === 0) {
    return { valid: false, message: '"category" cannot be empty.' };
  }

  if (!knownCategories.includes(value)) {
    return {
      valid: false,
      message: `Unknown category "${value}". Available categories: ${knownCategories.join(', ')}.`,
    };
  }

  return { valid: true, value };
}

module.exports = { validateLimit, validateCategory, MIN_LIMIT, MAX_LIMIT };
