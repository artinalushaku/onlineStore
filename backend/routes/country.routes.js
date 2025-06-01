import express from 'express';
import countryController from '../controllers/country.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', countryController.getAll);
router.post('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), countryController.add);
router.delete('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), countryController.delete);

export default router; 