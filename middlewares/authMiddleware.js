import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ message: 'No autorizado' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado' });
    }
};

export const isPremiumUser = (req, res, next) => {
    if (req.user && (req.user.role === 'premium' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado' });
    }
};
