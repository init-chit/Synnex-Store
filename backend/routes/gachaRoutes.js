const express = require('express');
const router = express.Router();
const gachaController = require('../controllers/gachaController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', gachaController.getAllBoxes); // ดูว่ามีกล่องอะไรบ้าง
router.post('/spin', authMiddleware, gachaController.spinBox); // กดสุ่ม (ต้องล็อกอิน)

module.exports = router;