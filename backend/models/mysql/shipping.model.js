import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';

const Shipping = sequelize.define('Shipping', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // Detajet e metodës së dërgesës
  name: {
    type: DataTypes.STRING,
    allowNull: false // p.sh. "Express", "Standard"
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estimatedDelivery: {
    type: DataTypes.STRING,
    allowNull: false // p.sh. "2-3 ditë"
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  description: {
    type: DataTypes.TEXT
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  countries: {
    type: DataTypes.JSON
  },
  // Detajet e adresës së dërgesës
  firstName: {
    type: DataTypes.STRING(50)
  },
  lastName: {
    type: DataTypes.STRING(50)
  },
  address1: {
    type: DataTypes.STRING(100)
  },
  address2: {
    type: DataTypes.STRING(100)
  },
  city: {
    type: DataTypes.STRING(50)
  },
  state: {
    type: DataTypes.STRING(50)
  },
  country: {
    type: DataTypes.STRING(50)
  },
  postalCode: {
    type: DataTypes.STRING(20)
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  // Detajet e gjurmimit
  trackingNumber: {
    type: DataTypes.STRING(100)
  },
  deliveryInstructions: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  actualDeliveryDate: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  tableName: 'shippings',
  underscored: true
});

// Përcakto lidhjet me modelet e tjera
Shipping.associate = (models) => {
  Shipping.belongsTo(models.Order, { foreignKey: 'orderId' });
  Shipping.belongsTo(models.User, { foreignKey: 'userId' });
};

export default Shipping;