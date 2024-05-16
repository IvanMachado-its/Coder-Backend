const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, age, password, userType } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario o correo electrónico ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, age, password: hashedPassword, userType });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el usuario');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      res.redirect('/products');
    } else {
      res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al iniciar sesión');
  }
});

module.exports = router;