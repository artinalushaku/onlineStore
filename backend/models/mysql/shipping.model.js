import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';

const Shipping = sequelize.define('Shipping', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estimatedDelivery: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  countries: {
    type: DataTypes.JSON, // Array vendesh ku eshte i disponueshem ky opsion dergese
    defaultValue: []
  }
});

export default Shipping;