const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Marrja e listes se deshirave te perdoruesit
router.get(
    '/',
    authMiddleware.protect,
    wishlistController.getUserWishlist
);

// Shtimi i nje produkti ne listen e deshirave
router.post(
    '/',
    authMiddleware.protect,
    wishlistController.addToWishlist
);

// Heqja e nje produkti nga lista e deshirave
router.delete(
    '/:productId',
    authMiddleware.protect,
    wishlistController.removeFromWishlist
);

// Pastrimi i listes se deshirave
router.delete(
    '/',
    authMiddleware.protect,
    wishlistController.clearWishlist
);

module.exports = router;