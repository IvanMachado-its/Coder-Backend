const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Leer las claves
const privateKey = fs.readFileSync(path.resolve(__dirname, '../../keys/private.key'), 'utf8');
const publicKey = fs.readFileSync(path.resolve(__dirname, '../../keys/public.key'), 'utf8');

const createToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    iat: Math.floor(Date.now() / 1000) - 60, 
    exp: Math.floor(Date.now() / 1000) + (10 * 60) 
  };
  
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
  } catch (err) {
    return null;
  }
};

module.exports = { createToken, verifyToken };
