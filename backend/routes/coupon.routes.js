const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discount.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply coupon (public endpoint)
router.post('/apply', discountController.applyCoupon);

// Admin routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.get('/', discountController.getAllDiscounts);
router.post('/', discountController.createDiscount);
router.put('/:id', discountController.updateDiscount);
router.delete('/:id', discountController.deleteDiscount);

module.exports = router; 