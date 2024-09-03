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

// Login de usuario
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
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
        } else {
            res.status(401).render('login', { title: 'Iniciar Sesión', error: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).render('login', { title: 'Iniciar Sesión', error: 'Error al iniciar sesión' });
    }
};
