const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/', gameController.getAllGames);
router.get('/:id/stock', gameController.getGameStock);

module.exports = router;