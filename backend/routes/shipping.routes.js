import express from 'express';
import shippingController from '../controllers/shipping.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Marrja e te gjitha metodave te dergeses (publike)
router.get('/', shippingController.getAllShipping);

// Marrja e nje metode dergese te vetme (publike)
router.get('/:id', shippingController.getShippingById);

// Krijimi i nje metode te re dergese (vetem admin)
router.post(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  shippingController.createShipping
);

// Perditesimi i nje metode dergese (vetem admin)
router.put(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  shippingController.updateShipping
);

// Fshirja e nje metode dergese (vetem admin)
router.delete(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  shippingController.deleteShipping
);

export default router;