// src/routes/authRouter.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, username: req.user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect('/');
  }
);

router.post('/register', async (req, res, next) => {
  passport.authenticate('register', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json({ message: 'User registered successfully', user });
    });
  })(req, res, next);
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return res.status(200).json({ message: 'User logged in successfully' });
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  req.logout();
  res.json({ message: 'User logged out successfully' });
});

module.exports = router;
