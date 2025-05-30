const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/send', protect, chatController.sendMessage);
router.get('/messages/:userId', protect, chatController.getMessages);
router.get('/conversations', protect, chatController.getConversations);
router.get('/conversation/:id', protect, chatController.getConversation);
router.put('/read/:messageId', protect, chatController.markAsRead);

module.exports = router; 