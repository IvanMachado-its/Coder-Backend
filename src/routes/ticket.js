// src/routes/ticket.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController'); // Verifica esta ruta
const authMiddleware = require('../middleware/authMiddleware');

// Definir las rutas
router.post('/generate', authMiddleware.ensureAuthenticated, ticketController.createTicket);
router.get('/:ticketId/verify', authMiddleware.ensureAuthenticated, ticketController.verifyCompletedPurchase);

module.exports = router;
