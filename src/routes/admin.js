// src/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta para el dashboard del admin
router.get('/dashboard', authMiddleware.isAdmin, adminController.dashboard);

module.exports = router;
