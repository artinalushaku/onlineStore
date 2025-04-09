import express from 'express';
import categoryController from '../controllers/category.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import uploadMiddleware from '../middleware/upload.middleware.js';

const router = express.Router();

// Marrja e te gjitha kategorive (publike)
router.get('/', categoryController.getAllCategories);

// Marrja e te gjitha kategorive ne forme te sheshte (publike)
router.get('/flat', categoryController.getAllCategoriesFlat);

// Marrja e nje kategorie te vetme (publike)
router.get('/:id', categoryController.getCategoryById);

// Krijimi i nje kategorie te re (vetem admin)
router.post(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  uploadMiddleware.single('image'),
  categoryController.createCategory
);

// Perditesimi i nje kategorie (vetem admin)
router.put(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  uploadMiddleware.single('image'),
  categoryController.updateCategory
);

// Fshirja e nje kategorie (vetem admin)
router.delete(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  categoryController.deleteCategory
);

export default router;