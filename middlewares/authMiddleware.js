// middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;  // Se obtiene el token de la cookie
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.redirect('/login');
        }
        next();
    } catch (err) {
        console.error('Error al verificar el token:', err);
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
