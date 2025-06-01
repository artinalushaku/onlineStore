const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    getNotifications,
    markAsRead,
    deleteNotification
} = require('../controllers/notification.controller');

// Rrugët e notifikimeve
router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router; 