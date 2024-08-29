import express from 'express';
import { createOrder, getUserOrders, getAllOrders } from '../controllers/orderController.js';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Crear una nueva orden
router.post('/', isAuthenticated, createOrder);

// Obtener las órdenes del usuario
router.get('/my-orders', isAuthenticated, getUserOrders);

// Obtener todas las órdenes (solo admin)
router.get('/', isAuthenticated, isAdmin, getAllOrders);

export default router;
