import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: Number, //MySQL ID
        required: true,
        index: true // This is defining an index on userId
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['order', 'product', 'promotion', 'system'],
        default: 'system'
    },
    relatedId: {
        type: String, //ID-ja e Porosise, Produktit, etj.
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

//Indeksi per kerkim me te shpejte
notificationSchema.index({
    createdAt: -1
});

export default mongoose.model('Notification', notificationSchema);