import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql';
import User from'./user.model';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shippingMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  discountCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  orderNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Relacioni me user
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

export default Order;