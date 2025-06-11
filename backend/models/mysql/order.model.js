import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';
import OrderItem from './orderItem.model.js';
import User from './user.model.js';
import Payment from './payment.model.js';
import Shipping from './shipping.model.js';
import Address from './address.model.js';

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
      model: 'User',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingAddressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Address',
      key: 'id'
    }
  },
  billingAddressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Address',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT
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
  subTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  shippingMethod: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'orders',
  underscored: true
});

export default Order;