const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');

// Public routes (optional auth)
router.get('/', optionalAuthMiddleware, recommendationController.getRecommendations);
router.get('/similar/:gameId', recommendationController.getSimilarGames);

module.exports = router;

