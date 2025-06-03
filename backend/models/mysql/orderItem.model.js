import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';
import Order from './order.model.js';

cconst OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'orders', key: 'id' }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'product', key: 'id' }
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  tableName: 'order_items',
  timestamps: true
});

OrderItem.associate = (models) => {
  OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
  OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
};

module.exports = OrderItem; 