const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (userData) => {
  const user = new User(userData);
  await user.save();
  const token = generateToken(user._id);
  return { user, token };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error('Invalid credentials');
  }
  const token = generateToken(user._id);
  return { user, token };
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
