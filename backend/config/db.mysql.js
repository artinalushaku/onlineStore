import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path (ensure it's loaded here too for this file's defaults)
dotenv.config({ path: path.join(__dirname, '../.env') });

// Set values for database configuration using DB_ prefixes
const dbConfig = {
  database: process.env.DB_NAME || 'onlinestore', // Use DB_NAME, fallback to default
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Use DB_PASSWORD, fallback to empty
  host: process.env.DB_HOST || 'localhost',
  port: process.env.PORT || 3306 // Use PORT from .env, fallback to 3306
};

// Konfigurimi i lidhjes me MySQL
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: 'mysql',
        logging: false, // Disable SQL query logging for cleaner output
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    }
);

// Remove the automatic connection test here to avoid duplicate logs
// sequelize.authenticate()
//     .then(() => {
//         logger.info('MySQL connection successful'); // Use the logger
//     })
//     .catch(err => {
//         logger.error('MySQL connection error:', err); // Use the logger
//     });

export default sequelize; 