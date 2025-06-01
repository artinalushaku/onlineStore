import express from 'express';
import productController from '../controllers/product.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import uploadMiddleware from '../middleware/upload.middleware.js';

const router = express.Router();

// Marrja e te gjitha produkteve (publike)
router.get('/', productController.getAllProducts);

// Marrja e nje produkti te vetem (publike)
router.get('/:id', productController.getProductById);

// Krijimi i nje produkti te ri (vetem admin)
router.post(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  uploadMiddleware.array('images', 5),
  productController.createProduct
);

// Perditesimi i nje produkti (vetem admin)
router.put(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  uploadMiddleware.array('images', 5),
  productController.updateProduct
);

// Fshirja e nje produkti (vetem admin)
router.delete(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  productController.deleteProduct
);

export default router;