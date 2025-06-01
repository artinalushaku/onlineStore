const express = require('express');
const router = express.Router();
const addressController = require('../controllers/address.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Të gjitha rrugët kërkojnë autentifikim
router.use(authMiddleware.protect);

// Marrja e të gjitha adresave të përdoruesit
router.get('/', addressController.getUserAddresses);

// Marrja e një adrese të vetme
router.get('/:id', addressController.getAddress);

// Krijimi i një adrese të re
router.post('/', addressController.createAddress);

// Përditësimi i një adrese
router.put('/:id', addressController.updateAddress);

// Fshirja e një adrese
router.delete('/:id', addressController.deleteAddress);

// Caktimi i një adrese si të parazgjedhur
router.put('/:id/default', addressController.setDefaultAddress);

module.exports = router;