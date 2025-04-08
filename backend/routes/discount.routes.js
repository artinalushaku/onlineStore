const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discount.controller');
const authMiddleware = require('../middleware/auth.middleware');

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

module.exports = router;