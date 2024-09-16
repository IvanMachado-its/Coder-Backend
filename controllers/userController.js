import User from '../models/User.js';
import sgMail from '@sendgrid/mail';

// Configuración de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.render('userManagement', { title: 'Gestión de Usuarios', users });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Eliminar usuarios inactivos
export const deleteInactiveUsers = async (req, res) => {
    try {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        const inactiveUsers = await User.find({ lastLogin: { $lt: twoDaysAgo } });

        for (const user of inactiveUsers) {
            await user.remove();
            await sendDeletionEmail(user.email, user.name);
        }

        res.json({ message: 'Usuarios inactivos eliminados' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos' });
    }
};

// Actualizar el rol de un usuario
export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        user.role = req.body.role;
        await user.save();
        res.redirect('/dashboard'); 
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el rol' });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await User.deleteOne({ _id: req.params.id });
        await sendDeletionEmail(user.email, user.name);

        res.redirect('/dashboard'); 
    } catch (err) {
        console.error('Error al eliminar el usuario:', err);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

// Función para enviar email de eliminación con SendGrid
const sendDeletionEmail = async (email, name) => {
    const msg = {
        to: email,
        from: 'ivanmachado146@gmail.com', 
        subject: 'Cuenta eliminada por inactividad',
        text: `Hola ${name}, tu cuenta ha sido eliminada por inactividad.`,
        html: `<strong>Hola ${name}</strong>, tu cuenta ha sido eliminada por inactividad.`,
    };

    try {
        await sgMail.send(msg);
        console.log('Correo enviado: ' + email);
    } catch (err) {
        console.error('Error al enviar el correo:', err);
    }
};
