const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shipping.controller');
const authMiddleware = require('../middleware/auth.middleware');

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

module.exports = router;