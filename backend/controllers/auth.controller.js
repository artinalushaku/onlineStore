const User = require('../models/mysql/user.model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

// Kontrolluesi i autentikimit
const authController = {
  // Regjistrimi i perdoruesve te rinj
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, phone, address, city, country, postalCode } = req.body;
      
      // Validime të shtuara
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'Të gjitha fushat e detyrueshme duhet të plotësohen' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Fjalëkalimi duhet të jetë së paku 6 karaktere' });
      }
      
      // Verifikojme nese perdoruesi ekziston
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Ky email është i zënë' });
      }
      
      // Krijojme perdoruesin e ri
      const user = await User.create({
        firstName,
        lastName,
        email,
        password, // Fjalekalimi do te hash-ohet nga hook-u beforeCreate
        phone,
        address,
        city,
        country,
        postalCode
      });
      
      // Gjenerojme token
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });
      
      return res.status(201).json({
        message: 'Regjistrimi u krye me sukses',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Gabim gjatë regjistrimit:', error);
      return res.status(500).json({ message: 'Gabim në server gjatë regjistrimit' });
    }
  },
  
  // Hyrja e perdoruesve
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email dhe fjalëkalimi janë të detyrueshëm' });
      }
      
      // Gjejme perdoruesin
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Email ose fjalëkalim i gabuar' });
      }
      
      // Verifikojme fjalekalimin
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email ose fjalëkalim i gabuar' });
      }
      
      // Gjenerojme token
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      });
      
      return res.status(200).json({
        message: 'Hyrja u krye me sukses',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Gabim gjatë hyrjes:', error);
      return res.status(500).json({ message: 'Gabim në server gjatë hyrjes' });
    }
  },
  
  // Kontrollo statusin e autentikimit
  checkAuth: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Përdoruesi nuk u gjet' });
      }
      
      return res.status(200).json({ user });
    } catch (error) {
      console.error('Gabim gjatë kontrollit të autentifikimit:', error);
      return res.status(500).json({ message: 'Gabim në server' });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Përdoruesi nuk u gjet' });
      }
      
      return res.status(200).json({ user });
    } catch (error) {
      console.error('Gabim gjatë marrjes së profilit:', error);
      return res.status(500).json({ message: 'Gabim në server' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, phone, address, city, country, postalCode } = req.body;
      
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Përdoruesi nuk u gjet' });
      }
      
      await user.update({
        firstName,
        lastName,
        phone,
        address,
        city,
        country,
        postalCode
      });
      
      return res.status(200).json({
        message: 'Profili u përditësua me sukses',
        user: user.getProfile()
      });
    } catch (error) {
      console.error('Gabim gjatë përditësimit të profilit:', error);
      return res.status(500).json({ message: 'Gabim në server' });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Të gjitha fushat janë të detyrueshme' });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Fjalëkalimi i ri duhet të jetë së paku 6 karaktere' });
      }
      
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Përdoruesi nuk u gjet' });
      }
      
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Fjalëkalimi aktual është i gabuar' });
      }
      
      user.password = newPassword;
      await user.save();
      
      return res.status(200).json({ message: 'Fjalëkalimi u ndryshua me sukses' });
    } catch (error) {
      console.error('Gabim gjatë ndryshimit të fjalëkalimit:', error);
      return res.status(500).json({ message: 'Gabim në server' });
    }
  }
};

module.exports = authController;