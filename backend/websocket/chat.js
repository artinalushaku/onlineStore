import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { process } from 'node:process';
import User from '../models/mysql/user.model.js';
import Chat from '../models/mongo/chat.model.js';

export const setupChatSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (err) {
            console.error('Socket authentication error:', err.message);
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        // Join user's room
        socket.join(socket.user.id);

        // Handle new message
        socket.on('sendMessage', async (data) => {
            const { receiverId, content } = data;
            
            // Emit to receiver
            io.to(receiverId).emit('newMessage', {
                sender: socket.user.id,
                content,
                createdAt: new Date()
            });
        });

        // Handle typing status
        socket.on('typing', (data) => {
            const { receiverId } = data;
            io.to(receiverId).emit('userTyping', {
                userId: socket.user.id
            });
        });

        // Handle stop typing
        socket.on('stopTyping', (data) => {
            const { receiverId } = data;
            io.to(receiverId).emit('userStopTyping', {
                userId: socket.user.id
            });
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.id);
        });
    });
}; 