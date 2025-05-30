const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const discountController = require('../controllers/discount.controller');
const userController = require('../controllers/user.controller');
const paymentController = require('../controllers/payment.controller');
const orderController = require('../controllers/order.controller');


// Konfigurimi i multer për ngarkimin e imazheve
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Mbrojtja e të gjitha rrugëve të adminit
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

// Rrugët për produktet
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Rrugët për kategoritë
router.get('/categories', adminController.getAllCategories);

// Rruga për ngarkimin e imazheve
router.post('/upload', upload.array('images'), adminController.uploadImages);




// Kuponët (Discounts)
router.get('/coupons', discountController.getAllDiscounts);
router.post('/coupons', discountController.createDiscount);
router.put('/coupons/:id', discountController.updateDiscount);
router.delete('/coupons/:id', discountController.deleteDiscount);

// User management endpoints (admin)
router.get('/users', userController.getAllUsers);
router.put('/users/:id/role', userController.updateUserRole);
router.put('/users/:id/status', userController.updateUserStatus);
router.delete('/users/:id', userController.deleteUser);

// Payments management endpoint (admin)
router.get('/payments', paymentController.getAllPayments);

// Orders management endpoints (admin)
router.get('/orders', orderController.getAllOrders);
router.patch('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router; 