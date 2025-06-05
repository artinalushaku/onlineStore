import Order from '../models/mysql/order.model.js';
import OrderItem from '../models/mysql/orderItem.model.js';
// import stripe from 'stripe';
import Payment from '../models/mysql/payment.model.js';
import User from '../models/mysql/user.model.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.mysql.js';

// Temporarily disabled Stripe
// const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

const paymentController = {
    // Create a new payment
    createPayment: async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
            const { orderId, amount, paymentMethod, paymentDetails } = req.body;
            const userId = req.user.id;

            // Find the order
            const order = await Order.findOne({
                where: { 
                    id: orderId,
                    userId,
                    paymentStatus: 'pending'
                },
                transaction
            });

            if (!order) {
                await transaction.rollback();
                return res.status(404).json({ 
                    message: 'Porosia nuk u gjet ose nuk është në gjendje për pagesë' 
                });
            }

            // Verify amount matches order total
            if (amount !== order.total) {
                await transaction.rollback();
                return res.status(400).json({ 
                    message: 'Shuma e pagesës nuk përputhet me totalin e porosisë' 
                });
            }

            // Create payment record
            const payment = await Payment.create({
                orderId,
                userId,
                amount,
                paymentMethod,
                paymentDetails,
                status: 'completed'
            }, { transaction });

            // Update order payment status
            await order.update({
                paymentStatus: 'paid',
                paymentId: payment.id
            }, { transaction });

            await transaction.commit();

            return res.status(201).json({
                message: 'Pagesa u krye me sukses',
                payment
            });
        } catch (error) {
            await transaction.rollback();
            console.error('Gabim gjatë kryerjes së pagesës:', error);
            return res.status(500).json({ 
                message: 'Gabim në server gjatë kryerjes së pagesës' 
            });
        }
    },

    // Get payment history for a user
    getUserPayments: async (req, res) => {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows: payments } = await Payment.findAndCountAll({
                where: { userId },
                include: [
                    { 
                        model: Order,
                        attributes: ['id', 'status', 'total', 'createdAt']
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return res.status(200).json({
                payments,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (error) {
            console.error('Gabim gjatë marrjes së historikut të pagesave:', error);
            return res.status(500).json({ 
                message: 'Gabim në server gjatë marrjes së historikut të pagesave' 
            });
        }
    },

    // Get payment details - temporarily disabled Stripe functionality
    getPaymentDetails: async (req, res) => {
        try {
            // const { sessionId } = req.params; // Removed unused variable
            return res.status(501).json({ 
                message: 'Stripe payment functionality is temporarily disabled' 
            });
        } catch (error) {
            console.error('Gabim gjate marrjes se detajeve te pageses:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate marrjes se detajeve te pageses' });
        }
    },

    // Get all payments (admin only)
    getAllPayments: async (req, res) => {
        try {
            const payments = await Payment.findAll({
                include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }],
                order: [['createdAt', 'DESC']]
            });
            res.json(payments);
        } catch (error) {
            console.error('Gabim gjatë marrjes së pagesave:', error);
            res.status(500).json({ message: 'Gabim në server' });
        }
    },

    // Krijimi i nje sesioni pagese me Stripe - temporarily disabled
    createCheckoutSession: async (req, res) => {
        return res.status(501).json({ 
            message: 'Stripe payment functionality is temporarily disabled' 
        });
    },

    // Webhook per te procesuar ngjarjet e Stripe - temporarily disabled
    handleWebhook: async (req, res) => {
        return res.status(501).json({ 
            message: 'Stripe payment functionality is temporarily disabled' 
        });
    }
};

export default paymentController;