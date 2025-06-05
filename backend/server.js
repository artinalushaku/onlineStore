import app from './app';
import http from 'http';
import { PORT } from './config/env';
import sequelize from './config/db.mysql';
import mongoose from 'mongoose';
import { MONGO_URI } from './config/db.mongo';
import initializeSocket from './websocket/socket';
import notificationService from './websocket/notification';
import chatService from './websocket/chat';
import logger from './utils/logger.utils';

// Krijimi i serverit HTTP
const server = http.createServer(app);

// Inicializimi i WebSocket
const io = initializeSocket(server);

// Krijimi i sherbimit te njoftimeve
const notifications = notificationService(io);

// Krijimi i sherbimit te chat
chatService(io);

// Bejme sherbimet e disponueshem globalisht
global.notifications = notifications;
app.set('io', io);

// Lidhja me bazen e te dhenave MySQL
const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Lidhja me MySQL u realizua me sukses');
    
    // Sinkronizimi i modeleve me bazen e te dhenave (ne zhvillim)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Modelet u sinkronizuan me bazen e te dhenave MySQL');
    }
  } catch (error) {
    logger.error(`Gabim gjate lidhjes me MySQL: ${error.message}`);
    process.exit(1);
  }
};

// Lidhja me bazen e te dhenave MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('Lidhja me MongoDB u realizua me sukses');
  } catch (error) {
    logger.error(`Gabim gjate lidhjes me MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Nisja e serverit
const startServer = async () => {
  try {
    // Lidhja me bazat e te dhenave
    await connectMySQL();
    await connectMongoDB();
    
    // Nisja e serverit
    server.listen(PORT, () => {
      logger.info(`Serveri eshte duke punuar ne portin ${PORT}`);
    });
  } catch (error) {
    logger.error(`Gabim gjate nisjes se serverit: ${error.message}`);
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
    logger.info('Lidhjet me bazat e te dhenave u mbyllen');
    process.exit(0);
  } catch (error) {
    logger.error(`Gabim gjate mbylljes se lidhjeve me bazat e te dhenave: ${error.message}`);
    process.exit(1);
  }
});