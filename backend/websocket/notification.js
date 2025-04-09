import Notification from '../models/mongo/notification.model';
import logger from '..utils/logger.utils';

//Sherbimi i njoftimeve
const notificationService = (io) => {
    //dergimi i nje njoftimi per nje perdorues te veqante
    const sendToUser = async (userId, title, message, type = 'system', relatedId = null)
        => {
        try {
            //ruajm njoftimin ne bazen e te dhenave
            const notification = new Notification({
                userId,
                title,
                message,
                type,
                relatedId,
                isRead: false
            });

            await notification.save();

            //dergojm njoftimin permes WebSocket
            io.to(`user:${userId}`).emit('notification', notification);

            return notification;
        } catch (error) {
            logger.error(`Error sending notification to user ${userId}: ${error.message}`);
            throw error;
        }
    };

    // Dergimi i nje njoftimi per te gjithe admin-at
    const sendToAdmins = async (title, message, type = 'system', relatedId = null) => {
        try {
            // Dergojme njoftimin permes WebSocket te te gjithe admin-at
            io.to('admin').emit('adminNotification', {
                title,
                message,
                type,
                relatedId,
                timestamp: new Date()
            });
        } catch (error) {
            logger.error(`Error sending notification to admins: ${error.message}`);
            throw error;
        }
    };

    // Marrja e njoftimeve te palexuara te nje perdoruesi
    const getUnreadNotifications = async (userId) => {
        try {
            return await Notification.find({ userId, isRead: false })
                .sort({ createdAt: -1 });
        } catch (error) {
            logger.error(`Error getting unread notifications for user ${userId}: ${error.message}`);
            throw error;
        }
    };

    // Shenimi i nje njoftimi si i lexuar
    const markAsRead = async (notificationId, userId) => {
        try {
            const notification = await Notification.findOneAndUpdate(
                { _id: notificationId, userId },
                { isRead: true },
                { new: true }
            );

            return notification;
        } catch (error) {
            logger.error(`Error marking notification as read: ${error.message}`);
            throw error;
        }
    };

    // Shenimi i te gjitha njoftimeve si te lexuara
    const markAllAsRead = async (userId) => {
        try {
            await Notification.updateMany(
                { userId, isRead: false },
                { isRead: true }
            );

            return { success: true };
        } catch (error) {
            logger.error(`Error marking all notifications as read: ${error.message}`);
            throw error;
        }
    };

    return {
        sendToUser,
        sendToAdmins,
        getUnreadNotifications,
        markAsRead,
        markAllAsRead
    };
};

export default notificationService;