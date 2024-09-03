import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Registrar nuevo usuario
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).render('register', { title: 'Registro', error: 'El correo electrónico ya está registrado' });
        }

        // Crear y guardar el nuevo usuario con el rol seleccionado
        const user = new User({ name, email, password, role: role || 'user' });
        await user.save();

        // Generar un token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Guardar el token en la sesión del usuario
        req.session.token = token;

        // Redirigir según el rol del usuario
        if (user.role === 'admin' || user.role === 'premium') {
            res.redirect('/dashboard');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
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

        // Generar token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Guardar token en una cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 día
            sameSite: 'strict',
        });

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error en el proceso de login:', error);
        res.status(500).render('login', { message: 'Error al iniciar sesión' });
    }
};
