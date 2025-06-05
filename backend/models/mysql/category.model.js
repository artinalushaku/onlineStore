import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.mysql.js';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true
});

// Self-referencing relationship for subcategories
Category.hasMany(Category, { 
  foreignKey: 'parent_id', 
  as: 'subcategories',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Category.belongsTo(Category, { 
  foreignKey: 'parent_id', 
  as: 'parent',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

export default Category;