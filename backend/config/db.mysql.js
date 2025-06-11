import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../.env') });

// FIXED: Use the correct environment variable names that match your .env file
const dbConfig = {
  database: process.env.MYSQL_DATABASE || 'onlinestore',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306  // FIXED: Use MYSQL_PORT, not PORT
};

// Debug: Log the configuration (remove after testing)
console.log('MySQL Configuration:', {
  database: dbConfig.database,
  user: dbConfig.user,
  host: dbConfig.host,
  port: dbConfig.port,
  password: dbConfig.password ? '***' : 'empty'
});

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

export default sequelize;