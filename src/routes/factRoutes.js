const express = require('express');
const factController = require('../controllers/factController');

const router = express.Router();

// IMPORTANT: /fact/today must be registered before any /fact/:param style
// route would be (we don't currently have one, but this keeps the file
// future-proof and avoids a common Express routing bug).
router.get('/fact/today', factController.getFactOfTheDay);
router.get('/fact', factController.getFact);
router.get('/facts', factController.getFacts);
router.get('/categories', factController.getCategories);

module.exports = router;
