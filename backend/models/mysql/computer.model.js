import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';

const Computer = sequelize.define('Computer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  // Other model options go here
  tableName: 'computers',
  timestamps: true,
  underscored: true
});

export default Computer; 