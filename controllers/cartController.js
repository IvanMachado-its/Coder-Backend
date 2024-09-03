import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';
import Ticket from '../models/Ticket.js';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        res.status(201).json({ cart, message: 'Producto agregado al carrito' });
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
        res.json({ cart, message: 'Producto eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar del carrito' });
    }
};

// Obtener el carrito del usuario
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        res.render('cart', { cart, title: 'Tu Carrito de Compras', user: req.user });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
};

// Realizar la compra (checkout)
export const checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        // Crear el Payment Intent en Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(cart.total * 100), // Stripe maneja los montos en centavos
            currency: 'usd',
            payment_method: req.body.paymentMethodId,
            confirm: true,
        });

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ message: 'El pago no se ha realizado con éxito' });
        }

        const ticket = new Ticket({
            user: req.user._id,
            products: cart.products,
            total: cart.total,
            paymentId: paymentIntent.id,
        });

        await ticket.save();

        // Enviar correo con el ticket
        sendTicketEmail(req.user.email, ticket);

        // Vaciar el carrito
        cart.products = [];
        await cart.save();

        res.json({ message: 'Compra realizada con éxito', paymentIntent });
    } catch (err) {
        res.status(500).json({ message: 'Error al realizar la compra' });
    }
};

// Enviar correo electrónico con el ticket de compra
const sendTicketEmail = (email, ticket) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: 'no-reply@ecommerce.com',
        to: email,
        subject: 'Ticket de compra',
        text: `Gracias por tu compra. Aquí está tu ticket:\n\n${ticket}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error(err.message);
        else console.log('Ticket enviado: ' + info.response);
    });
};
