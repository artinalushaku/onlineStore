import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';


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
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  billingAddress: {
    type: DataTypes.TEXT,
    allowNull: false
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
  }
}, {
  timestamps: true,
  tableName: 'orders',
  underscored: true
});

Order.associate = (models) => {
  Order.belongsTo(models.User, { foreignKey: 'userId' });
  Order.hasMany(models.Payment, { foreignKey: 'orderId' });
  Order.hasOne(models.Shipping, { foreignKey: 'orderId' });
  Order.hasMany(models.OrderItem, { as: 'items', foreignKey: 'orderId' });
};

module.exports = Order;