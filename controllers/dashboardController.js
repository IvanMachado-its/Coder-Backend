import Product from '../models/Product.js';
import User from '../models/User.js';

export const renderDashboard = async (req, res) => {
    try {
        let products = [];
        let users = [];
        
        if (req.user.role === 'premium') {
            products = await Product.find({ owner: req.user._id });
        }

        if (req.user.role === 'admin') {
            users = await User.find();
        }

        res.render('dashboard', {
            title: 'Panel de Control',
            user: req.user,
            products,
            users
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar el panel de control');
    }
};
