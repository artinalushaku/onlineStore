import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'EUR'
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING(100),
    unique: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentDate: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  tableName: 'payments',
  underscored: true
});

Payment.associate = (models) => {
  Payment.belongsTo(models.Order, { foreignKey: 'orderId' });
  Payment.belongsTo(models.User, { foreignKey: 'userId' });
};

export default Payment; 