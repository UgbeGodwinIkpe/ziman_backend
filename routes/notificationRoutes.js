const express = require('express');
const auth = require('../middleware/authMiddleware');
const { createNotification, fetchNotifications } = require('../controllers/notificationController');
const router = express.Router();

router.post('/', auth, createNotification);
router.get('/:user', auth, fetchNotifications);
module.exports = router;
