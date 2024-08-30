import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware para verificar si el usuario está autenticado.
 */
export const isAuthenticated = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No autorizado, falta el token' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        next();
    } catch (err) {
        console.error('Error al verificar el token', err);
        res.status(401).json({ message: 'No autorizado, token no válido' });
    }
};

/**
 * Middleware para verificar si el usuario es administrador.
 */
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        res.status(403).json({ message: 'Acceso denegado, se requiere rol de administrador' });
    }
};

/**
 * Middleware para verificar si el usuario es premium o administrador.
 */
export const isPremiumUser = (req, res, next) => {
    if (req.user && (req.user.role === 'premium' || req.user.role === 'admin')) {
        return next();
    } else {
        res.status(403).json({ message: 'Acceso denegado, se requiere rol de usuario premium o administrador' });
    }
};
