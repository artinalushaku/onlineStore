import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Krijimi i nje sesioni pagese me Stripe
router.post(
  '/create-checkout-session',
  authMiddleware.protect,
  paymentController.createCheckoutSession
);

// Webhook per te procesuar ngjarjet e Stripe
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// Marrja e detajeve te pageses
router.get(
  '/session/:sessionId',
  authMiddleware.protect,
  paymentController.getPaymentDetails
);

export default router;