import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: Number, // MySQL ID
    required: true,
    index: true // Define index here instead of separately
  },
  userName: {
    type: String,
    required: true
  },
  productId: {
    type: Number, // MySQL ID
    required: true,
    index: true // Define index here instead of separately
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  images: [{
    type: String // URL per imazhet
  }],
  helpful: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Remove duplicate index declarations
// reviewSchema.index({ productId: 1 });
// reviewSchema.index({ userId: 1 });

export default mongoose.model('Review', reviewSchema);