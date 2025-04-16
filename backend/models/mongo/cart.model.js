import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
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
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: {
        type: String,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: Number, // MySQL ID
        required: true,
        unique: true,
        index: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);