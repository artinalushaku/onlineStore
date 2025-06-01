import express from 'express';
import orderController from '../controllers/order.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Krijimi i nje porosie te re (vetem perdoruesit e identifikuar)
router.post(
  '/',
  authMiddleware.protect,
  orderController.createOrder
);

// Marrja e porosive te perdoruesit
router.get(
  '/me',
  authMiddleware.protect,
  orderController.getUserOrders
);

// Marrja e te gjitha porosive (vetem admin)
router.get(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  orderController.getAllOrders
);

// Marrja e nje porosie te vetme
router.get(
  '/:id',
  authMiddleware.protect,
  orderController.getOrderById
);

// Perditesimi i statusit te porosise (vetem admin)
router.patch(
  '/:id/status',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  orderController.updateOrderStatus
);

// Anulimi i nje porosie
router.post(
  '/:id/cancel',
  authMiddleware.protect,
  orderController.cancelOrder
);

export default router;