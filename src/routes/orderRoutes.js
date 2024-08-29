const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Crear una nueva orden
router.post('/', isAuthenticated, createOrder);

// Obtener las órdenes del usuario
router.get('/my-orders', isAuthenticated, getUserOrders);

// Obtener todas las órdenes (solo admin)
router.get('/', isAuthenticated, isAdmin, getAllOrders);

module.exports = router;
