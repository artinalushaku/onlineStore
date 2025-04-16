import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: Number, // MySQL ID
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: Number, // MySQL ID
        required: true,
        unique: true,
        index: true // Define index here
    },
    items: [wishlistItemSchema]
}, { timestamps: true });

// Remove duplicate index
// wishlistSchema.index({ userId: 1 });

export default mongoose.model('Wishlist', wishlistSchema);