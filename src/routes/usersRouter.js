const express = require('express');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const path = require('path');
const User = require('../models/User');

const router = express.Router();

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views', 'register.html'));
});

// Ruta para manejar el registro de usuario
router.post('/register', async (req, res) => {
  const { username, email, age, password, userType } = req.body;
  try {
    // Verificar si el usuario o el correo electrónico ya existen
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario o correo electrónico ya está en uso' });
    }

    // Generar un ID único y encriptar la contraseña
    const userId = uuid.v4();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    await User.create({ userId, username, email, age, password: hashedPassword, userType });

    // Redireccionar al formulario de login
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el usuario');
  }
});

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views', 'login.html'));
});

// Ruta para manejar el inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Buscar el usuario por nombre de usuario
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      // Guardar la sesión del usuario
      req.session.user = user;
      res.redirect('/products');
    } else {
      res.render('login', { error: 'Nombre de usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al iniciar sesión');
  }
});

// Ruta para manejar el cierre de sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al cerrar sesión');
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = router;
