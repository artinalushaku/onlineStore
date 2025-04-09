import express from 'express';
import sequelize from './db.js';

const app = express();

// Sync sequelize models
sequelize.sync({ alter: true })
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Failed to sync database:', err));

const PORT =  5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 

