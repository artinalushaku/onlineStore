const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

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

module.exports = router;