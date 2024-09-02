//dashboardController.js
import Product from '../models/Product.js';
import User from '../models/User.js';

export const renderDashboard = async (req, res) => {
    try {
        // Si req.user ya es un objeto plano, esto no será necesario.
        const user = req.user.toObject ? req.user.toObject() : req.user;

        const products = await Product.find();
        const users = await User.find().lean(); 

        res.render('dashboard', {
            title: 'Panel de Control',
            user, 
            products,
            users
        });
    } catch (err) {
        console.error('Error al cargar el panel de control:', err);
        res.status(500).send('Error al cargar el panel de control');
    }
};
