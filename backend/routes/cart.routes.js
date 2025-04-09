import express from 'express';
import cartController from '../controllers/cart.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Marrja e shportes se perdoruesit
router.get('/', authMiddleware, cartController.getUserCart);

// Shtimi i produktit ne shporte
router.post('/add', authMiddleware, cartController.addToCart);

// Perditesimi i sasise se produktit ne shporte
router.put('/update', authMiddleware, cartController.updateCartItem);

// Heqja e produktit nga shporta
router.delete('/remove/:productId', authMiddleware, cartController.removeFromCart);

// Pastrimi i shportes
router.delete('/clear', authMiddleware, cartController.clearCart);

export default router;