const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/auth');

async function register(username, password) {
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    return newUser;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function login(username, password) {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = generateToken({ id: user._id, username: user.username, role: user.role });
    return token;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  register,
  login,
};
