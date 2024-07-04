// src/controllers/authController.js

const AuthService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { user, token } = await AuthService.register(req.body);
    res.cookie('jwt', token, { httpOnly: true });
    res.redirect('/user/profile');
  } catch (error) {
    res.status(400).render('auth/register', { message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    res.cookie('jwt', token, { httpOnly: true });
    res.redirect('/user/profile');
  } catch (error) {
    res.status(400).render('auth/login', { message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('jwt');
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};

// Obtener información del usuario actual
exports.getCurrentUser = async (req, res) => {
  try {
    const { user } = req;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener información del usuario' });
  }
};

module.exports = exports;
