import Product from '../models/Product.js'; // Importación del modelo Product
import User from '../models/User.js';       // Importación del modelo User

export const renderDashboard = async (req, res) => {
    try {
        const user = req.user.toObject ? req.user.toObject() : req.user;
        const products = await Product.find().lean();
        const users = await User.find().lean();       

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
