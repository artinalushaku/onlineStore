import { process } from 'node:process';
import { Order, OrderItem } from '../models/mysql/order.model.js';
import stripe from 'stripe';
import Payment from '../models/mysql/payment.model.js';
import User from '../models/mysql/user.model.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.mysql.js';

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

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

    // Get payment details
    getPaymentDetails: async (req, res) => {
        try {
            const { sessionId } = req.params;
            
            // Marrja e sesionit nga Stripe
            const session = await stripeClient.checkout.sessions.retrieve(sessionId);
            
            if (!session) {
                return res.status(404).json({ message: 'Sesioni i pageses nuk u gjet' });
            }

            return res.status(200).json(session);
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

    // Krijimi i nje sesioni pagese me Stripe
    createCheckoutSession: async (req, res) => {
        try {
            const { orderId } = req.body;
            const userId = req.user.id;

            // Gjejme porosine
            const order = await Order.findOne({
                where: { id: orderId, userId },
                include: [{ model: OrderItem, as: 'items' }]
            });

            if (!order) {
                return res.status(404).json({ message: 'Porosia nuk u gjet' });
            }

            if (order.paymentStatus !== 'pending') {
                return res.status(400).json({ message: 'Kjo porosi eshte paguar tashme ose eshte anuluar' });
            }

            // Krijojme line_items per Stripe
            const lineItems = order.items.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.productName,
                        images: item.productImage ? [item.productImage] : []
                    },
                    unit_amount: Math.round(item.price * 100) // Stripe perdor cent/qindarka
                },
                quantity: item.quantity
            }));

            // Shtojme koston e dergeses
            if (order.shippingCost > 0) {
                lineItems.push({
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Dergesa - ${order.shippingMethod}`
                        },
                        unit_amount: Math.round(order.shippingCost * 100)
                    },
                    quantity: 1
                });
            }
            
            // Aplikojme zbritjen nese ka
            let discountAmount = 0;
            if (order.discountAmount > 0) {
                discountAmount = Math.round(order.discountAmount * 100);
            }
            
            // Krijojme sesionin e checkout-it
            const session = await stripeClient.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/order/cancel?order_id=${order.id}`,
                customer_email: req.user.email,
                client_reference_id: order.id.toString(),
                metadata: {
                    orderId: order.id.toString()
                },
                discounts: discountAmount > 0 ? [
                    {
                        coupon: await stripeClient.coupons.create({
                            amount_off: discountAmount,
                            currency: 'eur',
                            duration: 'once',
                            name: order.discountCode || 'Zbritje'
                        })
                    }
                ] : []
            });

            return res.status(200).json({
                sessionId: session.id,
                url: session.url
            });
        } catch (error) {
            console.error('Gabim gjate krijimit te sesionit te pageses:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate krijimit te sesionit te pageses' });
        }
    },

    // Webhook per te procesuar ngjarjet e Stripe
    handleWebhook: async (req, res) => {
        const signature = req.headers['stripe-signature'];
        let event;
        
        try {
            // Verifikojme nenshkrimin e webhook-ut
            event = stripeClient.webhooks.constructEvent(
                req.body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (error) {
            console.error('Gabim ne nenshkrimin e webhook-ut:', error);
            return res.status(400).send(`Webhook error: ${error.message}`);
        }
        
        try {
            let session, orderId, failedCharge, failedOrderId;
            // Procesojme ngjarjet e ndryshme
            switch (event.type) {
                case 'checkout.session.completed':
                    session = event.data.object;
                    orderId = session.metadata.orderId;
                    
                    // Perditesojme statusin e pageses se porosise
                    await Order.update(
                        {
                            paymentStatus: 'paid',
                            status: 'processing'
                        },
                        { where: { id: orderId } }
                    );
                    break;
                    
                case 'charge.failed':
                    failedCharge = event.data.object;
                    failedOrderId = failedCharge.metadata?.orderId;
                    
                    if (failedOrderId) {
                        // Perditesojme statusin e pageses se porosise si te deshtuar
                        await Order.update(
                            { paymentStatus: 'failed' },
                            { where: { id: failedOrderId } }
                        );
                    }
                    break;
            }

            return res.status(200).json({ received: true });
        } catch (error) {
            console.error('Gabim gjate procesimit te webhook-ut:', error);
            return res.status(500).json({ message: 'Gabim ne server gjate procesimit te webhook-ut' });
        }
    }
};

export default paymentController;