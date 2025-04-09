import express from 'express';
import reviewController from '../controllers/review.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import uploadMiddleware from '../middleware/upload.middleware.js';

const router = express.Router();

// Marrja e te gjitha recensioneve per nje produkt
router.get('/product/:productId', reviewController.getProductReviews);

// Krijimi i nje recensioni te ri
router.post('/',
  authMiddleware.protect,
  uploadMiddleware.array('images', 5),
  reviewController.createReview
);

// Perditesimi i nje recensioni
router.put('/:id',
  authMiddleware.protect,
  uploadMiddleware.array('images', 5),
  reviewController.updateReview
);

// Fshirja e nje recensioni
router.delete('/:id',
  authMiddleware.protect,
  reviewController.deleteReview
);

export default router;