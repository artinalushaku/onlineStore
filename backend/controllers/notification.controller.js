import Notification from '../models/mysql/notification.model.js';
import { catchAsync } from '../utils/catchAsync.utils.js';

const notificationController = {
    // Merr të gjitha notifikimet për një përdorues
    getNotifications: catchAsync(async (req, res) => {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 50
        });

        res.status(200).json({
            status: 'success',
            results: notifications.length,
            data: {
                notifications
            }
        });
    }),

    // Shëno një notifikim si të lexuar
    markAsRead: catchAsync(async (req, res) => {
        const [updated] = await Notification.update(
            { isRead: true },
            {
                where: {
                    id: req.params.id,
                    userId: req.user.id
                },
                returning: true
            }
        );

        if (!updated) {
            return res.status(404).json({
                status: 'fail',
                message: 'Notifikimi nuk u gjet'
            });
        }

        const notification = await Notification.findByPk(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                notification
            }
        });
    }),

    // Fshi një notifikim
    deleteNotification: catchAsync(async (req, res) => {
        const deleted = await Notification.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!deleted) {
            return res.status(404).json({
                status: 'fail',
                message: 'Notifikimi nuk u gjet'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    })
};

export default notificationController; 