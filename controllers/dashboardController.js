import Product from '../models/Product.js'; // Importación del modelo Product
import User from '../models/User.js';       // Importación del modelo User

export const renderDashboard = async (req, res) => {
    try {
        const user = req.user;
        let products = [];
        let users = [];

        // Si el usuario es admin, obtiene todos los productos y usuarios
        if (user.role === 'admin') {
            products = await Product.find().lean(); // Admin puede ver todos los productos
            users = await User.find().lean(); // Admin puede ver todos los usuarios
            console.log(`Administrador: ${user.name} viendo todos los productos.`);
        } 
        // Si el usuario es premium, solo obtiene sus propios productos
        else if (user.role === 'premium') {
            products = await Product.find({ user: user._id }).lean(); // Premium solo ve sus productos
            console.log(`Usuario premium: ${user.name} viendo sus productos.`);
        }

        // Renderizar el dashboard con los productos y, si es admin, también con los usuarios
        res.render('dashboard', {
            title: 'Panel de Control',
            user,
            products,
            users, // Solo se llena para admin
        });
    } catch (err) {
        console.error('Error al cargar el panel de control:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Hubo un problema al cargar el panel de control. Inténtalo más tarde.',
        });
    }
};