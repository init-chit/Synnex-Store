const express = require('express');
const router = express.Router();
const controller = require('../controllers/topupAdminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware, adminMiddleware);
router.get('/pending', controller.listPending);
router.post('/:id/review', controller.review);

module.exports = router;
