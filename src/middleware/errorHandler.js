const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Something broke!');
};
