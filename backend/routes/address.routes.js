import express from 'express';
import addressController from '../controllers/address.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

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

export default router;