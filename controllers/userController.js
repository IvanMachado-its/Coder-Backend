import User from '../models/User.js';
import nodemailer from 'nodemailer';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role');
        res.json(users);
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
            sendDeletionEmail(user.email);
        }

        res.json({ message: 'Usuarios inactivos eliminados' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos' });
    }
};

// Actualizar el rol de un usuario
export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        user.role = req.body.role;
        await user.save();
        res.json({ message: 'Rol actualizado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el rol' });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        await user.remove();
        res.json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

// Función para enviar email de eliminación
const sendDeletionEmail = (email) => {
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
        subject: 'Cuenta eliminada por inactividad',
        text: 'Tu cuenta ha sido eliminada por inactividad.',
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error(err.message);
        else console.log('Correo enviado: ' + info.response);
    });
};
