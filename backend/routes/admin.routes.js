import express from 'express';
import multer from 'multer';
import path from 'path';
import adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import discountController from '../controllers/discount.controller.js';
import userController from '../controllers/user.controller.js';
import paymentController from '../controllers/payment.controller.js';
import orderController from '../controllers/order.controller.js';
import wishlistController from '../controllers/wishlist.controller.js';
import cartController from '../controllers/cart.controller.js';
import statisticsController from '../controllers/statistics.controller.js';
import reviewController from '../controllers/review.controller.js';

const router = express.Router();

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
router.put('/users/:id', userController.updateUser);
router.put('/users/:id/role', userController.updateUserRole);
router.put('/users/:id/status', userController.updateUserStatus);
router.delete('/users/:id', userController.deleteUser);

// Wishlist management endpoint (admin)
router.get('/wishlists', wishlistController.getAllWishlistsForAdmin);

// Cart management endpoint (admin)
router.get('/carts', cartController.getAllCartsForAdmin);
router.delete('/carts/:cartId', cartController.deleteCartByIdForAdmin);

// Payments management endpoint (admin)
router.get('/payments', paymentController.getAllPayments);

// Orders management endpoints (admin)
router.get('/orders', orderController.getAllOrders);
router.patch('/orders/:id/status', orderController.updateOrderStatus);

// Statistics endpoint (admin)
router.get('/statistics', statisticsController.getStatistics);

// Merr të gjitha review-t për admin
router.get('/reviews', reviewController.getAllReviews);

// Ndrysho statusin e review-t
router.put('/reviews/:id/status', reviewController.updateReviewStatus);

// Fshi një review
router.delete('/reviews/:id', reviewController.deleteReview);

export default router; 