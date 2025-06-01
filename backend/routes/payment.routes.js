const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');

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

module.exports = router;