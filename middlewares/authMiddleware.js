import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAdminOrPremium = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'premium')) {
        console.log(`Acceso permitido para ABM de productos al rol: ${req.user.role}`);
        return next();
    } else {
        console.log(`Acceso denegado para ABM de productos. Rol: ${req.user.role}`);
        return res.status(403).json({ message: 'Acceso denegado, se requiere rol de administrador o premium' });
    }
};

export const isAuthenticated = async (req, res, next) => {
    if (req.cookies.token) {
        try {
            // Verificar y decodificar el token JWT
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            console.log(`Token decodificado: ${JSON.stringify(decoded)}`);

            // Cargar el usuario desde la base de datos
            req.user = await User.findById(decoded.id).select('-password');
            if (req.user) {
                console.log(`Usuario autenticado: ${req.user.name}, Rol: ${req.user.role}`);
                res.locals.user = req.user;
                return next();
            } else {
                console.log('Usuario no encontrado');
            }
        } catch (err) {
            console.error('Error al verificar el token:', err);
            res.clearCookie('token');
        }
    } else {
        console.log('Token no encontrado');
    }
    res.redirect('/login');
};

export const isAuthorizedForDashboard = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'premium')) {
        console.log(`Acceso permitido para el rol: ${req.user.role}`);
        return next(); // Si el rol es admin o premium, permitir
    } else {
        console.log(`Acceso denegado para el rol: ${req.user.role}`);
        return res.redirect('/');  // Redirigir si no tiene el rol adecuado
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
