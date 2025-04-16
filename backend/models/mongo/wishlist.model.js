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
        unique: true
    },
    items: [wishlistItemSchema]
}, { timestamps: true });

// Indeksi per kerkim me te shpejte
wishlistSchema.index({ userId: 1 });

export default mongoose.model('Wishlist', wishlistSchema);