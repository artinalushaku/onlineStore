import sequelize from '../../config/db.mysql';
import fs from 'fs';
import path from 'path';

// Automatikisht importoj të gjitha modelet
const models = {};
const modelsPath = path.join(__dirname);

fs.readdirSync(modelsPath)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== 'index.js' &&
            file.slice(-3) === '.js'
        );
    })
    .forEach(file => {
        const model = require(path.join(modelsPath, file));
        models[model.name] = model;
    });

// Lidh modelet nëse kanë lidhje
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

module.exports = {
    ...models,
    sequelize
}; 