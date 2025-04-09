import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';
import process from 'process';
// MongoDB configuration with Mongoose
const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export { MONGO_URI, connectMongoDB };