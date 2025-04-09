import express from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Regjistrimi i perdoruesit te ri
router.post('/register', userController.register);

// Hyrja ne sistem
router.post('/login', userController.login);

// Marrja e profilit personal
router.get('/profile',
  authMiddleware.protect,
  userController.getProfile
);

// Perditesimi i profilit personal
router.put('/profile',
  authMiddleware.protect,
  userController.updateProfile
);

// Ndryshimi i fjalekalimit
router.put('/change-password',
  authMiddleware.protect,
  userController.changePassword
);

// Kerkesa per rivendosjen e fjalekalimit
router.post('/forgot-password', userController.forgotPassword);

// Rivendosja e fjalekalimit
router.post('/reset-password/:token', userController.resetPassword);

// Admin routes
// Marrja e te gjithe perdoruesve
router.get('/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  userController.getAllUsers
);

// Marrja e nje perdoruesi te vetem
router.get('/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  userController.getUserById
);

// Perditesimi i nje perdoruesi
router.put('/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  userController.updateUser
);

// Fshirja e nje perdoruesi
router.delete('/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  userController.deleteUser
);

export default router;