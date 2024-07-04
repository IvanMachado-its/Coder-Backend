// src/routes/ticket.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', authMiddleware.ensureAuthenticated, ticketController.createTicket);
router.get('/:ticketId/verify', authMiddleware.ensureAuthenticated, ticketController.verifyCompletedPurchase);

module.exports = router;
