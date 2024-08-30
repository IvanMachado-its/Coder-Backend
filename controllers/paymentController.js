import stripe from '../config/stripe.js';
import Cart from '../models/Cart.js';
import Ticket from '../models/Ticket.js';
import nodemailer from 'nodemailer';

export const processPayment = async (req, res) => {
    try {
        const { paymentMethodId } = req.body;
        const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        // Calcular el total del carrito
        const amount = cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0);

        // Crear el pago en Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convertir a centavos
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ message: 'El pago no se ha realizado con éxito' });
        }

        // Generar el ticket de compra
        const ticket = new Ticket({
            user: req.user._id,
            products: cart.products,
            total: amount,
            paymentId: paymentIntent.id,
        });

        await ticket.save();

        // Enviar ticket por correo electrónico
        sendTicketEmail(req.user.email, ticket);

        // Vaciar el carrito después del pago
        cart.products = [];
        await cart.save();

        res.status(200).json({ message: 'Pago exitoso y ticket generado', ticket });
    } catch (err) {
        res.status(500).json({ message: 'Error en el proceso de pago', error: err.message });
    }
};

// Función para enviar el ticket por correo electrónico
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
