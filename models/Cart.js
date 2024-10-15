import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        }
    }],
    totalPrice: {
        type: Number,
        default: 0,
    },
    itemCount: {  // Nuevo campo para contar el total de productos
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

// Creación del modelo basado en el esquema
const Cart = mongoose.model('Cart', cartSchema);

// Exportación por defecto del modelo
export default Cart;