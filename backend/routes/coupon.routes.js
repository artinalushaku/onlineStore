import express from 'express';
import discountController from '../controllers/discount.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply coupon (public endpoint)
router.post('/apply', discountController.applyCoupon);

// Admin routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.get('/', discountController.getAllDiscounts);
router.post('/', discountController.createDiscount);
router.put('/:id', discountController.updateDiscount);
router.delete('/:id', discountController.deleteDiscount);

export default router; 