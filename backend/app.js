import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/upload.routes.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importimi i rrugëve
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import cartRoutes from './routes/cart.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import adminRoutes from './routes/admin.routes.js';
import shippingRoutes from './routes/shipping.routes.js';
import addressRoutes from './routes/address.routes.js';
import chatRoutes from './routes/chat.routes.js';
import countryRoutes from './routes/country.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import reportRoutes from './routes/report.routes.js';
import orderRoutes from './routes/order.routes.js';
import contactRoutes from './routes/contact.routes.js';
import reviewRoutes from './routes/review.routes.js';

// Krijo aplikacionin Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);


export default app; 