import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from backend folder
dotenv.config({ path: path.join(__dirname, '../.env') });

// Inicializimi i Sequelize me variabla mjedisi
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true, // Per te perfshire createdAt dhe updatedAt
    underscored: true, // Perdor format 'snake_case' per kolonat ne bazen e te dhenave
    freezeTableName: false, // Mund te perdoret per te mos i shtuar 's' ne fund te emrit te tabeles
    charset: 'utf8mb4', // Mbeshtetja e karaktereve Unicode
    dialectOptions: {
      collate: 'utf8mb4_unicode_ci'
    }
  },
  pool: {
    max: 5, // Numri maksimal i lidhjeve ne pool
    min: 0, // Numri minimal i lidhjeve ne pool
    acquire: 30000, // Koha maksimale, ne milisekonda, qe nje lidhje mund te jete ne pritje
    idle: 10000 // Koha maksimale, ne milisekonda, qe nje lidhje mund te jete e pashfrytezuar
  }
});

export default sequelize;