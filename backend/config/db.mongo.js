import mongoose from 'mongoose';
import logger from '../utils/logger.utils';

// Konfigurimi i lidhjes me MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://erionshahini22:ixBSZS9oaPypfH3R@cluster0.kw7hn3t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Opsionet e lidhjes
const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    // Opsione shtesë për cluster
    ssl: true,
    authSource: 'admin',
    retryWrites: true,
    w: 'majority'
};

// Lidhja me MongoDB
mongoose.connect(MONGO_URI, options)
.then(() => {
    logger.info('Lidhja me MongoDB Atlas u krijua me sukses.');
})
.catch(err => {
    logger.error('Gabim në lidhjen me MongoDB Atlas:', err);
});

// Trajtimi i lidhjeve të humbura
mongoose.connection.on('disconnected', () => {
    logger.warn('Lidhja me MongoDB u humb. Po përpiqem të ristartoj...');
    setTimeout(() => {
        mongoose.connect(MONGO_URI, options);
    }, 5000);
});

// Trajtimi i gabimeve të lidhjes
mongoose.connection.on('error', (err) => {
    logger.error('Gabim në lidhjen me MongoDB:', err);
});

module.exports = {
    MONGO_URI,
    mongoose
}; 