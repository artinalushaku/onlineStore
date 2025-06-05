import 'dotenv/config';
import logger from '../utils/logger.utils.js';

// Debug: Log environment variables (without sensitive data)
logger.info('Loading environment variables...');
logger.info(`MYSQL_HOST: ${process.env.MYSQL_HOST || 'not set'}`);
logger.info(`MYSQL_DATABASE: ${process.env.MYSQL_DATABASE || 'not set'}`);
logger.info(`MYSQL_USER: ${process.env.MYSQL_USER || 'not set'}`);
logger.info(`MONGO_URI: ${process.env.MONGO_URI ? 'set' : 'not set'}`);

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
export const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
export const MYSQL_PORT = process.env.MYSQL_PORT || 3306;
export const MYSQL_USER = process.env.MYSQL_USER || 'root';
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'onlinestore';
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlinestore'; 