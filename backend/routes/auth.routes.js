const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/mysql/user.model');

// Rrugët e autentifikimit
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware.protect, authController.checkAuth);

// Rrugët e përdoruesit (të mbrojtura)
router.get('/profile', authMiddleware.protect, authController.getProfile);
router.put('/profile', authMiddleware.protect, authController.updateProfile);
router.put('/password', authMiddleware.protect, authController.updatePassword);

// Endpoint për të marrë të gjithë përdoruesit për chat
router.get('/users', authMiddleware.protect, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email'],
      where: { id: { [User.sequelize.Op.ne]: req.user.id } }, // mos e përfshi veten
      order: [['firstName', 'ASC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë marrjes së përdoruesve' });
  }
});

// Endpoint për të marrë një admin për chat
router.get('/any-admin', authMiddleware.protect, async (req, res) => {
  try {
    const admin = await User.findOne({ where: { role: 'admin' }, attributes: ['id', 'firstName', 'lastName', 'email'] });
    if (!admin) return res.status(404).json({ message: 'Nuk u gjet asnjë admin' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë kërkimit të adminit' });
  }
});

module.exports = router;