import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render('register', { title: 'Registro', error: 'El correo electrónico ya está registrado' });
        }

        const user = new User({ name, email, password, role: role || 'user' });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
            sameSite: 'strict',
        });

        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).render('register', { title: 'Registro', error: 'Error al registrar el usuario' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).render('login', { message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000, // 15 minutos
            sameSite: 'strict',
        });

        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).render('login', { message: 'Error al iniciar sesión' });
    }
};

export const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('token');
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};
