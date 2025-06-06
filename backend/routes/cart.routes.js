import express from 'express';
import cartController from '../controllers/cart.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Marrja e shportes se perdoruesit
router.get('/', authMiddleware.protect, cartController.getUserCart);

// Shtimi i produktit ne shporte
router.post('/add', authMiddleware.protect, cartController.addToCart);

// Perditesimi i sasise se produktit ne shporte
router.put('/update/:productId', authMiddleware.protect, cartController.updateCartItem);

// Heqja e produktit nga shporta
router.delete('/remove/:productId', authMiddleware.protect, cartController.removeFromCart);

// Pastrimi i shportes
router.delete('/clear', authMiddleware.protect, cartController.clearCart);

// New route for cart count
router.get('/count', authMiddleware.protect, cartController.getCartCount);

export default router;