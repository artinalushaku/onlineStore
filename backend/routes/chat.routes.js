import express from 'express';
import chatController from '../controllers/chat.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send', authMiddleware.protect, chatController.sendMessage);
router.get('/messages/:userId', authMiddleware.protect, chatController.getMessages);
router.get('/conversations', authMiddleware.protect, chatController.getConversations);
router.get('/conversation/:id', authMiddleware.protect, chatController.getConversation);
router.put('/read/:messageId', authMiddleware.protect, chatController.markAsRead);

export default router; 