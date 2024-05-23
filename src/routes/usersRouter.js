// src/routes/usersRouter.js
const express = require('express');
const passport = require('passport');
const { generateToken } = require('../config/jwtUtils');
const { createUser, findUserByUsername } = require('../services/userService');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, age, password, userType } = req.body;
    const user = await createUser({ username, email, age, password, userType });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    const token = generateToken(user);
    res.json({ token });
  })(req, res, next);
});

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

module.exports = router;
