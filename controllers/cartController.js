import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Añadir un producto al carrito
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                products: [{ product: productId, quantity }],
            });
        } else {
            const existingProduct = cart.products.find(item => item.product.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error al añadir al carrito' });
    }
};

// Eliminar un producto del carrito
export const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(item => item.product.toString() !== req.params.productId);

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar del carrito' });
    }
};

// Obtener el carrito del usuario
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
};

// Realizar la compra (checkout)
export const checkout = async (req, res) => {
    try {
        const { paymentMethodId } = req.body;

        // Procesar el pago y generar el ticket
        const paymentResponse = await processPayment(req, res);

        if (paymentResponse.status !== 200) {
            return res.status(paymentResponse.status).json({ message: paymentResponse.message });
        }

        res.json({ message: 'Compra realizada con éxito', ticket: paymentResponse.ticket });
    } catch (err) {
        res.status(500).json({ message: 'Error al realizar la compra' });
    }
};
