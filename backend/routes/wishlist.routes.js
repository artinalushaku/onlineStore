import express from 'express';
import wishlistController from '../controllers/wishlist.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Marrja e listes se deshirave te perdoruesit
router.get('/',
  authMiddleware.protect,
  wishlistController.getUserWishlist
);

// Shtimi i nje produkti ne listen e deshirave
router.post('/',
  authMiddleware.protect,
  wishlistController.addToWishlist
);

// Heqja e nje produkti nga lista e deshirave
router.delete('/:productId',
  authMiddleware.protect,
  wishlistController.removeFromWishlist
);

// Pastrimi i listes se deshirave
router.delete('/',
  authMiddleware.protect,
  wishlistController.clearWishlist
);

export default router;