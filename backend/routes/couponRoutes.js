const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

router.post('/check', couponController.checkCoupon); // เช็คคูปอง

module.exports = router;