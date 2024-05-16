const express = require('express');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, email, age, password, userType } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario o correo electrónico ya está en uso' });
    }

    const userId = uuid.v4();
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ userId, username, email, age, password: hashedPassword, userType });

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el usuario');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
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
