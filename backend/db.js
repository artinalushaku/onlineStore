import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('onlinestore', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

export default sequelize;