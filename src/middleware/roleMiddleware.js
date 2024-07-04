exports.ensureAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  };
  
  exports.ensureUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  };
  