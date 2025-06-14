import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';

const Discount = sequelize.define('Discount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  validFrom: {
    type: DataTypes.DATE,
    allowNull: false
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false
  },
  minimumPurchase: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(10,2),
    field: 'max_discount',
    allowNull: true,
  },
});

export default Discount;