import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

// Método de checkout y envío de recibo
// Método de checkout y redirección a Stripe
export const checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'No hay productos en el carrito' });

        // Crear la sesión de pago con Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cart.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.product.name,
                    },
                    unit_amount: Math.round(item.product.price * 100), // Stripe requiere centavos
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
        });

        // Devolver la URL de la sesión de pago
        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Error en el proceso de pago:', err);
        res.status(500).json({ message: 'Error en el proceso de pago' });
    }
};
export const checkoutSuccess = async (req, res) => {
    try {
        const { session_id } = req.query;

        // Obtener la sesión de Stripe para verificar el pago
        const session = await stripe.checkout.sessions.retrieve(session_id);

        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!session || !cart) {
            return res.status(400).render('error', { message: 'Error al recuperar la sesión de pago o carrito vacío.' });
        }

        // Enviar el recibo de compra por email
        await sendReceiptEmail(req.user.email, req.user.name, cart.items, session.amount_total / 100);

        // Vaciar el carrito tras una compra exitosa
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.render('checkoutSuccess', { title: 'Compra Exitosa', session });
    } catch (err) {
        console.error('Error en checkoutSuccess:', err);
        res.status(500).render('error', { message: 'Error al procesar el éxito del pago' });
    }
};


// Función para enviar el recibo por email usando SendGrid
const sendReceiptEmail = async (email, name, items, totalPrice) => {
    const itemList = items.map(item => `<li>${item.product.name} - Cantidad: ${item.quantity} - Precio: $${item.product.price}</li>`).join('');

    const msg = {
        to: email,
        from: 'ivanmachado146@gmail.com',
        subject: 'Recibo de tu compra',
        html: `
            <h1>Gracias por tu compra, ${name}!</h1>
            <p>A continuación los detalles de tu pedido:</p>
            <ul>
                ${itemList}
            </ul>
            <p><strong>Total: $${totalPrice}</strong></p>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Recibo enviado a:', email);
    } catch (err) {
        console.error('Error al enviar el recibo:', err);
    }
};
