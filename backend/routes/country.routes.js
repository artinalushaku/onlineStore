const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', countryController.getAll);
router.post('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), countryController.add);
router.delete('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), countryController.delete);

module.exports = router; 