import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import reportController from '../controllers/report.controller.js';

const router = express.Router();

// Protect all report routes (only admin)
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

// Route to generate a report
router.post('/generate', reportController.generateReport);

export default router; 