import Message from '../models/mongo/chat.model.js';
import User from '../models/mysql/user.model.js';

const chatController = {
    sendMessage: async (req, res) => {
        try {
            const { receiverId, content } = req.body;
            const senderId = req.user.id;

            const message = new Message({
                sender: String(senderId),
                receiver: receiverId ? String(receiverId) : 'admin',
                content: content
            });

            await message.save();

            if (receiverId && receiverId !== 'admin') {
                req.app.get('io').to(String(receiverId)).emit('message', message);
            } else {
                req.app.get('io').to('admin').emit('message', message);
            }

            res.status(201).json({
                success: true,
                data: message,
                conversationId: message._id
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Gabim në dërgimin e mesazhit',
                error: error.message
            });
        }
    },

    getMessages: async (req, res) => {
        try {
            const { userId } = req.params;
            const currentUserId = String(req.user.id);

            const messages = await Message.find({
                $or: [
                    { sender: currentUserId, receiver: String(userId) },
                    { sender: String(userId), receiver: currentUserId },
                    { receiver: 'admin', sender: currentUserId },
                    { receiver: null, sender: currentUserId }
                ]
            }).sort({ createdAt: 1 });

            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Gabim në marrjen e mesazheve',
                error: error.message
            });
        }
    },

    getConversations: async (req, res) => {
        try {
            const currentUserId = String(req.user.id);
            const isAdmin = req.user.role === 'admin';

            // Merr të gjitha mesazhet e fundit për çdo bisedë
            const conversations = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { sender: currentUserId },
                            { receiver: currentUserId },
                            ...(isAdmin ? [{ receiver: 'admin' }] : [])
                        ]
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: {
                            $cond: {
                                if: { $eq: ['$sender', currentUserId] },
                                then: '$receiver',
                                else: '$sender'
                            }
                        },
                        lastMessage: { $first: '$$ROOT' }
                    }
                },
                {
                    $lookup: {
                        from: 'user',
                        let: { userId: { $toInt: '$_id' } },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
                            { $project: { _id: 1, firstName: 1, lastName: 1, email: 1 } }
                        ],
                        as: 'user'
                    }
                },
                {
                    $addFields: {
                        user: {
                            $cond: [
                                { $gt: [{ $size: '$user' }, 0] },
                                { $arrayElemAt: ['$user', 0] },
                                { firstName: 'Përdorues', lastName: 'i ri', email: '' }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        lastMessage: 1,
                        user: 1
                    }
                }
            ]);

            res.status(200).json({
                success: true,
                data: conversations
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Gabim në marrjen e bisedave',
                error: error.message
            });
        }
    },

    markAsRead: async (req, res) => {
        try {
            const { messageId } = req.params;
            
            const message = await Message.findByIdAndUpdate(
                messageId,
                { read: true },
                { new: true }
            );

            res.json(message);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getConversation: async (req, res) => {
        try {
            const { id } = req.params;
            const currentUserId = String(req.user.id);

            const messages = await Message.find({
                $or: [
                    { _id: id },
                    { sender: currentUserId, receiver: id },
                    { sender: id, receiver: currentUserId }
                ]
            }).sort({ createdAt: 1 });

            if (messages.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Biseda nuk u gjet'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    messages,
                    conversationId: id
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Gabim në marrjen e bisedës',
                error: error.message
            });
        }
    },

    deleteConversation: async (req, res) => {
        try {
            const { id } = req.params;
            await Message.deleteMany({
                $or: [
                    { sender: id },
                    { receiver: id }
                ]
            });
            res.status(200).json({ success: true, message: 'Biseda u fshi me sukses.' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Gabim gjatë fshirjes së bisedës.', error: error.message });
        }
    }
};

export default chatController; 