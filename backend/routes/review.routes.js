const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

// Marrja e komenteve per nje produkt (publike)
router.get('/product/:productId', reviewController.getProductReviews);

// Krijimi i nje komenti te ri (vetem perdoruesit e identifikuar)
router.post(
  '/',
  authMiddleware.protect,
  uploadMiddleware.array('images', 3),
  reviewController.createReview
);

// Perditesimi i nje komenti (vetem pronari i komentit)
router.put(
  '/:id',
  authMiddleware.protect,
  uploadMiddleware.array('images', 3),
  reviewController.updateReview
);

// Fshirja e nje komenti (pronari ose admin)
router.delete(
  '/:id',
  authMiddleware.protect,
  reviewController.deleteReview
);

module.exports = router;