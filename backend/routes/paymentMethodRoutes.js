const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentMethodController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', controller.list);
router.post('/', [authMiddleware, adminMiddleware], controller.create);
router.put('/:id', [authMiddleware, adminMiddleware], controller.update);
router.delete('/:id', [authMiddleware, adminMiddleware], controller.remove);

module.exports = router;
