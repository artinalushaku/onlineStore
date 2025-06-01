import express from 'express';
import discountController from '../controllers/discount.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Validimi i nje kodi zbritjeje (per perdoruesit)
router.post(
  '/validate',
  authMiddleware.protect,
  discountController.validateDiscount
);

// Marrja e te gjitha kodeve te zbritjes (vetem admin)
router.get(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  discountController.getAllDiscounts
);

// Marrja e nje kodi zbritjeje te vetem (vetem admin)
router.get(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  discountController.getDiscountById
);

// Krijimi i nje kodi te ri zbritjeje (vetem admin)
router.post(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  discountController.createDiscount
);

// Perditesimi i nje kodi zbritjeje (vetem admin)
router.put(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  discountController.updateDiscount
);

// Fshirja e nje kodi zbritjeje (vetem admin)
router.delete(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  discountController.deleteDiscount
);

export default router;