const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// เส้นทางซื้อเกม
router.post('/buy', authMiddleware, transactionController.buyGame);

// เส้นทางดูประวัติ (*** บรรทัดนี้แหละที่น่าจะหายไป หรือเขียนผิด ***)
router.get('/history', authMiddleware, transactionController.getMyHistory);

module.exports = router;