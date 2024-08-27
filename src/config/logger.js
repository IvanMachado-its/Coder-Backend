const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(), // Imprime logs en la consola
    new winston.transports.File({ filename: 'error.log', level: 'error' }) // Guarda logs de errores en un archivo
  ],
});

module.exports = logger;
