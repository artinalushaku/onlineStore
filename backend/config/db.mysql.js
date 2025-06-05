import { Sequelize } from 'sequelize';
require('dotenv').config();
import logger from '../utils/logger.utils';

// Konfigurimi i lidhjes me MySQL
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
        logging: (msg) => logger.info(msg),
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

// Testimi i lidhjes
sequelize.authenticate()
    .then(() => {
        logger.info('Lidhja me MySQL u krijua me sukses.');
    })
    .catch(err => {
        logger.error('Gabim në lidhjen me MySQL:', err);
    });

module.exports = sequelize; 