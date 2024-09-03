import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
    total: { type: Number, required: true, default: 0 },
    updatedAt: { type: Date, default: Date.now },
});

// Middleware para calcular el total antes de guardar el carrito
cartSchema.pre('save', async function(next) {
    this.total = this.products.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
