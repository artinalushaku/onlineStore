import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';

const Country = sequelize.define('Country', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  timestamps: false,
  tableName: 'countries',
  underscored: true
});

export default Country; 