const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Merr listën e dëshirave të përdoruesit
router.get('/', authMiddleware.protect, wishlistController.getWishlist);

// Merr numrin e artikujve në listën e dëshirave
router.get('/count', authMiddleware.protect, wishlistController.getWishlistCount);

// Shton produkt në listën e dëshirave
router.post('/add/:productId', authMiddleware.protect, wishlistController.addToWishlist);

// Fshin produkt nga lista e dëshirave
router.delete('/remove/:productId', authMiddleware.protect, wishlistController.removeFromWishlist);

// Fshin të gjithë listën e dëshirave
router.delete('/clear', authMiddleware.protect, wishlistController.clearWishlist);

module.exports = router;