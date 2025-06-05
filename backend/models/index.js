import path from 'path';
import fs from 'fs';
import sequelize from '../config/db.mysql';

// Eksportoj modelet nga MySQL
const mysqlModels = {};
const mysqlModelsPath = path.join(__dirname, 'mysql');

// Së pari, importoj të gjitha modelet
fs.readdirSync(mysqlModelsPath)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== 'index.js' &&
            file.slice(-3) === '.js'
        );
    })
    .forEach(file => {
        const model = require(path.join(mysqlModelsPath, file));
        const modelName = model.name;
        mysqlModels[modelName] = model;
    });

// Pastaj, lidh modelet
Object.keys(mysqlModels).forEach(modelName => {
    if (typeof mysqlModels[modelName].associate === 'function') {
        mysqlModels[modelName].associate(mysqlModels);
    }
});

// Eksportoj modelet nga MongoDB
const mongoModels = {};
const mongoModelsPath = path.join(__dirname, 'mongo');

fs.readdirSync(mongoModelsPath)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== 'index.js' &&
            file.slice(-3) === '.js'
        );
    })
    .forEach(file => {
        const model = require(path.join(mongoModelsPath, file));
        const modelName = model.modelName || file.split('.')[0];
        mongoModels[modelName] = model;
    });

module.exports = {
    mysql: mysqlModels,
    mongo: mongoModels
}; 