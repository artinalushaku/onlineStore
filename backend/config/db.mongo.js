import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from backend folder
dotenv.config({ path: path.join(__dirname, '../.env') });

// MongoDB configuration with Mongoose
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Removed deprecated options
   // console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export const MONGO_URI = process.env.MONGO_URI;
export { connectMongoDB };