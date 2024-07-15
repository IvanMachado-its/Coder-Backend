const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

exports.extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Token extraction error: ${error.message}`);
    res.status(401).send('Unauthorized');
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};
