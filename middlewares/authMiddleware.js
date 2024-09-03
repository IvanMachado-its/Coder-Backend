import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {
    const token = req.session.token;
    console.log('Token en la sesión:', token);

    if (!token) {
        console.log('Token no encontrado, redirigiendo al login');
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);

        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            console.log('Usuario no encontrado, destruyendo la sesión y redirigiendo al login');
            req.session.destroy(); // Destruir la sesión si no se encuentra el usuario
            return res.redirect('/login');
        }

        console.log('Usuario autenticado:', req.user);
        next();
    } catch (err) {
        console.error('Error al verificar el token:', err);
        req.session.destroy(); // Destruir la sesión si hay un error con el token
        return res.redirect('/login');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        res.status(403).json({ message: 'Acceso denegado, se requiere rol de administrador' });
    }
};

export const isPremiumUser = (req, res, next) => {
    if (req.user && (req.user.role === 'premium' || req.user.role === 'admin')) {
        return next();
    } else {
        res.status(403).json({ message: 'Acceso denegado, se requiere rol de usuario premium o administrador' });
    }
};
