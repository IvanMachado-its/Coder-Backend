import Product from '../models/Product.js'; // Importación del modelo Product
import User from '../models/User.js';       // Importación del modelo User

export const renderDashboard = async (req, res) => {
    try {
        // Convertir el usuario a un objeto si es necesario
        const user = req.user.toObject ? req.user.toObject() : req.user;

        // Obtener productos que pertenecen al usuario autenticado
        const products = await Product.find().lean();
        let users = [];

        // Si el usuario es admin, cargar todos los usuarios
        if (user.role === 'admin') {
            users = await User.find().lean();
        }

        // Renderizar la vista del dashboard, pasando los productos y usuarios (solo para admin)
        res.render('dashboard', {
            title: 'Panel de Control',
            user, 
            products,
            users
        });
    } catch (err) {
        console.error('Error al cargar el panel de control:', err);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Hubo un problema al cargar el panel de control. Inténtalo más tarde.',
        });
    }
};
