import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the path to the .env file
const envPath = path.join(__dirname, './.env');

// Load environment variables early
dotenv.config({ path: envPath });

// Set NODE_ENV to development if not set in .env (to enable sync)
const currentEnv = process.env.NODE_ENV || 'development';

import app from './app.js';
import http from 'http';
// import { PORT } from './config/env.js'; // We are hardcoding the port now
import sequelize from './config/db.mysql.js';
import mongoose from 'mongoose';
import { MONGO_URI } from './config/db.mongo.js';
import { setupWebSocket } from './websocket/socket.js';
import notificationService from './websocket/notification.js';
import { setupChatSocket } from './websocket/chat.js';
import logger from './utils/logger.utils.js';

// Import all MySQL models
import Computer from './models/mysql/computer.model.js';
import Address from './models/mysql/address.model.js';
import User from './models/mysql/user.model.js';
import Order from './models/mysql/order.model.js';
import OrderItem from './models/mysql/orderItem.model.js';
import Payment from './models/mysql/payment.model.js';
import Shipping from './models/mysql/shipping.model.js';
import Country from './models/mysql/country.model.js';
import Product from './models/mysql/product.model.js';
import Discount from './models/mysql/discount.model.js';
import Category from './models/mysql/category.model.js';
import Notification from './models/mysql/notification.model.js';

// Import all MongoDB models
import Chat from './models/mongo/chat.model.js';
import Cart from './models/mongo/cart.model.js';
import Wishlist from './models/mongo/wishlist.model.js';
import Review from './models/mongo/review.model.js';
import MongoNotification from './models/mongo/notification.model.js';

// Krijimi i serverit HTTP
const server = http.createServer(app);

// Inicializimi i WebSocket
const io = setupWebSocket(server);

// Krijimi i sherbimit te njoftimeve
const notifications = notificationService(io);

// Krijimi i sherbimit te chat
setupChatSocket(io);

// Bejme sherbimet e disponueshem globalisht
global.notifications = notifications;
app.set('io', io);

// Define sync order for MySQL models
const syncOrder = [
  User,           // First create users table
  Category,       // Then categories (self-referencing)
  Product,        // Then products
  Country,        // Then countries
  Address,        // Then addresses (depends on users)
  Order,          // Then orders (depends on users)
  OrderItem,      // Then order items (depends on orders and products)
  Payment,        // Then payments (depends on orders and users)
  Shipping,       // Then shipping (depends on orders and users)
  Computer,       // Then computer products
  Discount,       // Then discounts
  Notification    // Finally notifications
];

// Lidhja me bazen e te dhenave MySQL
const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL database connected successfully');
    
    // Safe sync in development to avoid data loss
    if (currentEnv === 'development') {
      try {
        // Just sync models without force (does not drop tables)
        for (const model of syncOrder) {
          await model.sync();
          logger.info(`Synced table: ${model.name}`);
        }
        logger.info('MySQL database sync completed successfully');
      } catch (syncError) {
        console.error('MySQL database sync error:', syncError);
        throw syncError;
      }
    }
  } catch (error) {
    console.error('MySQL Error:', error);
    logger.error(`MySQL connection error: ${error.message}`);
    throw error;
  }
};

// Lidhja me bazen e te dhenave MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('MongoDB database connected successfully');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`); // Keep logger error
  }
};

// Nisja e serverit
const startServer = async () => {
  try {
    // logger.info('Connecting to databases...'); // Remove debug log
    await Promise.all([
      connectMySQL(),
      connectMongoDB()
    ]);
    
    // Hardcode the application port to 5000 to avoid conflict with MySQL (3306)
    const appPort = 5000;
    // console.log(`Attempting to start server on hardcoded port: ${appPort}`); // Remove debug log
    
    server.listen(appPort, '0.0.0.0', () => {
      logger.info(`Server running on port ${appPort}`);
    });
  } catch (error) {
    logger.error(`Server startup error: ${error.message}`); // Keep logger error
    process.exit(1);
  }
};

// Nisim serverin
startServer();

// Trajtimi i sinjaleve te nderprerjes
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Error closing database connections: ${error.message}`); // Keep logger error
    process.exit(1);
  }
});

