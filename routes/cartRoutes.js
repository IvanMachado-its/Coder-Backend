// routes/cartRoutes.js
import express from 'express';
import { addToCart, getCart, checkout, removeFromCart } from '../controllers/cartController.js';  // Importa removeFromCart
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ver el carrito
router.get('/', isAuthenticated, getCart);

// Añadir producto al carrito
router.post('/add', isAuthenticated, addToCart);

// Eliminar producto del carrito
router.post('/remove', isAuthenticated, removeFromCart); // Asegúrate de que esté definida

// Checkout
router.post('/checkout', isAuthenticated, checkout);

export default router;
