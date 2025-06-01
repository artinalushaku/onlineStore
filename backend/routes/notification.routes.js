import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    getNotifications,
    markAsRead,
    deleteNotification,
    getUnreadCount
} from '../controllers/notification.controller.js';

const router = express.Router();

// Rrugët e notifikimeve
router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

export default router; 