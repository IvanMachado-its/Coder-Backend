// controllers/cartController.js
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Añadir producto al carrito
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });
        }

        // Revisar si el producto ya está en el carrito
        const existingItem = cart.items.find(item => item.product.equals(productId));
        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            cart.items.push({ product: productId, quantity });
        }

        // Calcular el nuevo total
        cart.totalPrice += product.price * quantity;
        await cart.save();

        res.status(200).json({ message: 'Producto agregado al carrito', cart });
    } catch (err) {
        console.error('Error al agregar al carrito:', err);
        res.status(500).json({ message: 'Error al agregar al carrito' });
    }
};

// Mostrar el carrito
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product').lean();
        if (!cart) return res.render('cart', { title: 'Carrito', items: [], totalPrice: 0 });

        res.render('cart', { title: 'Carrito', items: cart.items, totalPrice: cart.totalPrice });
    } catch (err) {
        console.error('Error al cargar el carrito:', err);
        res.status(500).render('error', { message: 'Error al cargar el carrito' });
    }
};

// Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;  // Obtener el ID del producto desde el formulario
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');  // Asegúrate de popular el producto

        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        // Filtrar los items para eliminar el producto
        cart.items = cart.items.filter(item => !item.product._id.equals(productId));

        // Verifica si el precio del producto es válido
        const isValidPrice = item => item.product && item.product.price && !isNaN(item.product.price);

        // Recalcular el precio total con verificación de precios válidos
        if (cart.items.length > 0) {
            cart.totalPrice = cart.items.reduce((total, item) => {
                if (isValidPrice(item)) {
                    return total + item.product.price * item.quantity;
                }
                return total; 
            }, 0);
        } else {
            cart.totalPrice = 0;  
        }

        await cart.save();

        res.redirect('/cart');  // Redirige al carrito nuevamente
    } catch (err) {
        console.error('Error al eliminar producto del carrito:', err);
        res.status(500).json({ message: 'Error al eliminar producto del carrito' });
    }
};

export const checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) return res.status(400).json({ message: 'No hay productos en el carrito' });

        // Crear sesión de pago en Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cart.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.name,
                    },
                    unit_amount: Math.round(item.product.price * 100), // en centavos
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
        });

        // Redirigir a la URL de Stripe Checkout
        res.redirect(303, session.url);
    } catch (err) {
        console.error('Error en el proceso de pago:', err);
        res.status(500).json({ message: 'Error en el proceso de pago' });
    }
};
