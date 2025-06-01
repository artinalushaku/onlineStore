import express from 'express';
import sequelize from './config/db.mysql.js';
import { connectMongoDB } from './config/db.mongo.js';

// Import MySQL models
import './models/mysql/user.model.js';
import './models/mysql/category.model.js';
import './models/mysql/discount.model.js';
import './models/mysql/shipping.model.js';
import './models/mysql/product.model.js';
import './models/mysql/order.model.js';
import './models/mysql/orderItem.model.js';
import './models/mysql/address.model.js';
import './models/mysql/notification.model.js';
import './models/mysql/payment.model.js';
import './models/mysql/country.model.js';

// Import MongoDB models
import './models/mongo/cart.model.js';
import './models/mongo/wishlist.model.js';
import './models/mongo/review.model.js';
import './models/mongo/notification.model.js';
import './models/mongo/chat.model.js';

const app = express();

// Connect to MongoDB
connectMongoDB()
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sync sequelize models
sequelize.sync({ alter: true })
  .then(() => console.log('MySQL Database connected'))
  .catch(err => console.error('Failed to sync MySQL database:', err));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});