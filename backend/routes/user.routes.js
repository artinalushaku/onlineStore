const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Marrja e profilit te perdoruesit
router.get(
  '/profile',
  authMiddleware.protect,
  userController.getUserProfile
);

// Perditesimi i profilit te perdoruesit
router.put(
  '/profile',
  authMiddleware.protect,
  userController.updateUserProfile
);

// Ndryshimi i fjalekalimit
router.put(
  '/change-password',
  authMiddleware.protect,
  userController.changePassword
);

// Marrja e te gjithe perdoruesve (vetem admin)
router.get(
  '/',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  userController.getAllUsers
);

// Marrja e nje perdoruesi te vetem (vetem admin)
router.get(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  userController.getUserById
);

// Perditesimi i nje perdoruesi (vetem admin)
router.put(
  '/:id',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  userController.updateUser
);

// Rivendosja e fjalekalimit (vetem admin)
router.put(
  '/:id/reset-password',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  userController.resetUserPassword
);

module.exports = router;