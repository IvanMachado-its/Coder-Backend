import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {
    if (req.cookies.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (req.user) {
                res.locals.user = req.user;
                return next();
            }
        } catch (err) {
            console.error('Error al verificar el token:', err);
            res.clearCookie('token');
        }
    }
    res.redirect('/login');
};

// Middleware para permitir solo a usuarios admin y premium acceder al dashboard
export const isAuthorizedForDashboard = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'premium')) {
        return next();
    } else {
        return res.redirect('/');  // Redirigir a `index` si el rol es 'user'
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
