const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/game/:gameId', reviewController.getGameReviews);

// Authenticated routes
router.post('/game/:gameId', authMiddleware, reviewController.createReview);
router.put('/:reviewId', authMiddleware, reviewController.updateReview);
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview);
router.post('/:reviewId/helpful', reviewController.markHelpful);
router.get('/user/my-reviews', authMiddleware, reviewController.getUserReviews);

module.exports = router;

