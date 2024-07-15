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
