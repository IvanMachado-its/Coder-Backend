const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger'); // Asegúrate de tener un archivo de configuración de logger

// Define directamente la clave secreta del JWT
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1NiIsImVtYWlsIjoidXN1YXJpb0BleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYyMjU1MzYwMCwiZXhwIjoxNjIyNTU3MjAwfQ.g2s4u5sU8KS3xFHwh2sdfFDSK4dlfldk23k34LSF4w0'; // Define tu clave secreta directamente en el archivo

// Middleware para extraer el usuario del token JWT
exports.extractUserFromToken = async (req, res, next) => {
  const token = req.cookies.jwt;  // Verificar si el token JWT está en las cookies
  
  if (!token) {
    return next();  // Si no hay token, continuar sin extraer usuario
  }

  try {
    // Verificar y decodificar el token usando la clave secreta
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar el usuario en la base de datos sin devolver la contraseña
    const user = await User.findById(decoded.id).select('-password');
    
    // Si el usuario existe, lo añadimos a la solicitud
    req.user = user;
    next();
  } catch (error) {
    // Registrar el error si la extracción falla
    logger.error(`Token extraction error: ${error.message}`);
    return res.status(401).send('Unauthorized');
  }
};

// Middleware para verificar si el usuario tiene rol de admin
exports.isAdmin = (req, res, next) => {
  // Verificar si el usuario está presente y tiene el rol de administrador
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // Enviar respuesta de error si no es admin
    return res.status(403).send('Forbidden');
  }
};
