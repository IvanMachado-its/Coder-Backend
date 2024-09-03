import express from 'express';
import { getCart, addToCart, removeFromCart, checkout } from '../controllers/cartController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Obtener el carrito del usuario
router.get('/', isAuthenticated, getCart);

// Añadir un producto al carrito
router.post('/add', isAuthenticated, addToCart);

// Eliminar un producto del carrito
router.post('/remove/:productId', isAuthenticated, removeFromCart);

// Realizar la compra (checkout)
router.post('/checkout', isAuthenticated, checkout);

export default router;
