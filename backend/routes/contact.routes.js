import express from 'express';
import Message from '../models/mongo/chat.model.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Public contact endpoint
router.post('/', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: 'Mesazhi nuk mund të jetë bosh.' });
        }
        const message = new Message({
            sender: 'contact_form',
            receiver: 'admin',
            content: content.trim(),
            read: false
        });
        await message.save();
        res.status(201).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gabim gjatë dërgimit të mesazhit.', error: error.message });
    }
});

// Endpoint to get all contact form messages for admin
router.get('/messages', authMiddleware.protect, authMiddleware.restrictTo('admin'), async (req, res) => {
    try {
        const messages = await Message.find({
            sender: 'contact_form',
            receiver: 'admin'
        }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gabim gjatë marrjes së mesazheve të kontaktit.', error: error.message });
    }
});

// Endpoint to mark a contact message as deleted
router.put('/:messageId/delete', authMiddleware.protect, authMiddleware.restrictTo('admin'), async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findByIdAndUpdate(
            messageId,
            { deleted: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ success: false, message: 'Mesazhi nuk u gjet.' });
        }

        res.status(200).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gabim gjatë fshirjes së mesazhit.', error: error.message });
    }
});

export default router; 