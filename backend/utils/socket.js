const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/mysql/user.model');
const logger = require('../utils/logger.utils');

// Inicializimi i WebSocket
const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
  // Middleware per autentikimin
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Ju nuk jeni i autentikuar'));
      }
      
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return next(new Error('Perdoruesi nuk u gjet'));
      }
      
      socket.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };
      
      next();
    } catch (error) {
      logger.error(`Socket auth error: ${error.message}`);
      next(new Error('Autentikimi deshtoi'));
    }
  });
  
  // Kur nje klient lidhet
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.id}`);
    
    // Antaresimi ne dhomen personale
    socket.join(`user:${socket.user.id}`);
    
    // Nese perdoruesi eshte admin, antaresohet ne dhomen e admin-ave
    if (socket.user.role === 'admin') {
      socket.join('admin');
    }
    
    // Kur nje klient shkeputet
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user.id}`);
    });
  });
  
  return io;
};

module.exports = initializeSocket;