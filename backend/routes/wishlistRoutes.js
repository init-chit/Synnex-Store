const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.get('/', authMiddleware, wishlistController.getWishlist);
router.get('/ids', authMiddleware, wishlistController.getWishlistIds);
router.post('/:gameId', authMiddleware, wishlistController.addToWishlist);
router.delete('/:gameId', authMiddleware, wishlistController.removeFromWishlist);
router.get('/check/:gameId', authMiddleware, wishlistController.checkWishlist);
router.post('/toggle/:gameId', authMiddleware, wishlistController.toggleWishlist);

module.exports = router;

