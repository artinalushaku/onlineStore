import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/mysql/user.model.js';
import logger from '../utils/logger.utils.js';
import { setupChatSocket } from './chat.js';
import notificationService from './notification.js';

// Inicializimi i WebSocket
export const setupWebSocket = (app) => {
    const io = new Server(app, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Middleware per autentikimin
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error('Ju nuk jeni i autentikuar'));
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return next(new Error('Perdoruesi nuk u gjet'));
            }

            socket.user = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            next();
        } catch (error) {
            logger.error(`Socket auth error: ${error.message}`);
            next(new Error('Autentikimi deshtoi'));
        }
    });

    // Kur nje klient lidhet
    io.on('connection', (socket) => {
        logger.info(`User connected: ${socket.user.id}`);

        // Antaresimi ne dhomen personale
        socket.join(`user:${socket.user.id}`);

        // Nese perdoruesi eshte admin, antaresohet ne dhomen e admin-ave
        if (socket.user.role === 'admin') {
            socket.join('admin');
        }

        // Kur nje klient shkeputet
        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${socket.user.id}`);
        });

        // Handle get unread notifications
        socket.on('getUnreadNotifications', async () => {
            try {
                const notifications = await notificationService.getUnreadNotifications(socket.user.id);
                socket.emit('unreadNotifications', notifications);
            } catch (error) {
                logger.error(`Error getting unread notifications: ${error.message}`);
                socket.emit('error', { message: 'Error getting notifications' });
            }
        });

        // Handle mark notification as read
        socket.on('markAsRead', async (notificationId) => {
            try {
                const notification = await notificationService.markAsRead(notificationId, socket.user.id);
                socket.emit('notificationRead', notification);
            } catch (error) {
                logger.error(`Error marking notification as read: ${error.message}`);
                socket.emit('error', { message: 'Error marking notification as read' });
            }
        });

        // Handle mark all notifications as read
        socket.on('markAllAsRead', async () => {
            try {
                await notificationService.markAllAsRead(socket.user.id);
                socket.emit('allNotificationsRead');
            } catch (error) {
                logger.error(`Error marking all notifications as read: ${error.message}`);
                socket.emit('error', { message: 'Error marking all notifications as read' });
            }
        });
    });

    // Setup chat socket
    setupChatSocket(io);

    // Setup notification service
    const notification = notificationService(io);

    return io;
};