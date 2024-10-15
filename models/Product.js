import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String, // URL de la imagen del producto
        required: true,
    },
    category: {
        type: String, // Categoría del producto
        required: true,
    },
    stock: {
        type: Number, // Cantidad disponible
        default: 0,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

export default mongoose.model('Product', productSchema);
