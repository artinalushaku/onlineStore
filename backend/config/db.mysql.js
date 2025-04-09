import { Sequelize } from 'sequelize';
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } from './env.js';

// Inicializimi i Sequelize me variabla mjedisi
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
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