import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import uploadRoutes from './routes/upload.routes';

// Importimi i rrugëve
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import wishlistRoutes from './routes/wishlist.routes';
import adminRoutes from './routes/admin.routes';
import shippingRoutes from './routes/shipping.routes';
import addressRoutes from './routes/address.routes'; // Shtuar rrugët e adresave
import chatRoutes from './routes/chat.routes';
import countryRoutes from './routes/country.routes';
import couponRoutes from './routes/coupon.routes';

// Krijo aplikacionin Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurimi i logimit
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));

// Rrugët e API-së
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/addresses', addressRoutes); // Shtuar rrugët e adresave
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/coupons', couponRoutes);

// Rrugë për shërbimet statike
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rrugë për gabimet 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rruga nuk u gjet' });
});

// Rrugë për gabimet e serverit
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Gabim në server' });
});

module.exports = app;