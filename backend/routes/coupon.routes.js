import express from 'express';
import discountController from '../controllers/discount.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import Discount from '../models/mysql/discount.model.js';
import { Op } from 'sequelize';

const router = express.Router();

// Apply coupon (public endpoint)
router.post('/apply', discountController.validateDiscount);

// Coupon validation endpoint for checkout
router.post('/validate', authMiddleware.protect, async (req, res) => {
    const { code, cartTotal } = req.body;
    try {
        const discount = await Discount.findOne({
            where: {
                code,
                isActive: true,
                validFrom: { [Op.lte]: new Date() },
                validUntil: { [Op.gte]: new Date() },
                [Op.or]: [
                    { usage_limit: null },
                    { usage_count: { [Op.lt]: Discount.sequelize.col('usage_limit') } }
                ]
            }
        });
        if (!discount) {
            return res.json({ valid: false, amount: 0 });
        }
        if (cartTotal < discount.minimumPurchase) {
            return res.json({ valid: false, amount: 0 });
        }
        let amount = 0;
        if (discount.type === 'percentage') {
            amount = (cartTotal * discount.value) / 100;
            if (discount.maxDiscount && amount > discount.maxDiscount) {
                amount = discount.maxDiscount;
            }
        } else if (discount.type === 'fixed') {
            amount = discount.value;
            if (discount.maxDiscount && amount > discount.maxDiscount) {
                amount = discount.maxDiscount;
            }
        }
        return res.json({ valid: true, amount });
    } catch (err) {
        return res.status(500).json({ message: 'Gabim gjatë validimit të kuponit' });
    }
});

// Admin routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.get('/', discountController.getAllDiscounts);
router.post('/', discountController.createDiscount);
router.put('/:id', discountController.updateDiscount);
router.delete('/:id', discountController.deleteDiscount);

export default router; 