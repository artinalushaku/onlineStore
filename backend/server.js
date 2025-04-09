import express from 'express';
import sequelize from './config/db.mysql.js';

// Import MySQL models
import './models/mysql/user.model.js';
import './models/mysql/category.model.js';
import './models/mysql/discount.model.js';
import './models/mysql/shipping.model.js';

const app = express();

// Sync sequelize models
sequelize.sync({ alter: true })
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Failed to sync database:', err));

const PORT =  5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 

