const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Marrja e shportes se perdoruesit
router.get(
    '/',
    authMiddleware.protect,
    cartController.getUserCart
);

// Shtimi i nje produkti ne shporte
router.post(
    '/',
    authMiddleware.protect,
    cartController.addToCart
);

// Perditesimi i sasise se nje produkti ne shporte
router.put(
    '/',
    authMiddleware.protect,
    cartController.updateCartItem
);

// Heqja e nje produkti nga shporta
router.delete(
    '/:productId',
    authMiddleware.protect,
    cartController.removeFromCart
);

// Pastrimi i shportes
router.delete(
    '/',
    authMiddleware.protect,
    cartController.clearCart
);

module.exports = router;