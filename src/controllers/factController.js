const factService = require('../services/factService');
const { validateLimit, validateCategory } = require('../utils/validators');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/fact
 * GET /api/fact?category=space
 */
function getFact(req, res, next) {
  try {
    const categories = factService.getAllCategories();
    const categoryCheck = validateCategory(req.query.category, categories);

    if (!categoryCheck.valid) {
      throw ApiError.badRequest(categoryCheck.message, { availableCategories: categories });
    }

    const fact = factService.getRandomFact(categoryCheck.value);

    if (!fact) {
      throw ApiError.notFound('No facts found for the given category.');
    }

    res.status(200).json(fact);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/facts?limit=10
 * GET /api/facts?limit=10&category=animals
 */
function getFacts(req, res, next) {
  try {
    const categories = factService.getAllCategories();
    const categoryCheck = validateCategory(req.query.category, categories);
    const limitCheck = validateLimit(req.query.limit);

    if (!categoryCheck.valid) {
      throw ApiError.badRequest(categoryCheck.message, { availableCategories: categories });
    }
    if (!limitCheck.valid) {
      throw ApiError.badRequest(limitCheck.message);
    }

    const facts = factService.getRandomFacts(limitCheck.value, categoryCheck.value);

    res.status(200).json({
      count: facts.length,
      requestedLimit: limitCheck.value,
      category: categoryCheck.value || 'all',
      facts,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/categories
 */
function getCategories(req, res, next) {
  try {
    const categories = factService.getAllCategories();
    res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/fact/today
 */
function getFactOfTheDay(req, res, next) {
  try {
    const fact = factService.getFactOfTheDay();

    if (!fact) {
      throw ApiError.notFound('No facts are currently available.');
    }

    res.status(200).json(fact);
  } catch (err) {
    next(err);
  }
}

module.exports = { getFact, getFacts, getCategories, getFactOfTheDay };
