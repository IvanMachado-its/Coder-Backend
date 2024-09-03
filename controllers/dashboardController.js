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

        // Responder con una vista de error más amigable
        res.status(500).render('error', {
            title: 'Error',
            message: 'Hubo un problema al cargar el panel de control. Inténtalo más tarde.',
        });
    }
};
