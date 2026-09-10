const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

// เส้นทาง API กระเป๋าเงิน
router.get('/me', authMiddleware, walletController.getMyWallet);
router.post('/topup', authMiddleware, walletController.topUp);
router.post('/daily', authMiddleware, walletController.dailyCheckIn); 

module.exports = router;