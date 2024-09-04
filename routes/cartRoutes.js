// routes/cartRoutes.js
import express from 'express';
import { addToCart, getCart, checkout,removeFromCart } from '../controllers/cartController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Eliminar producto del carrito
router.post('/remove', isAuthenticated, removeFromCart);

// Añadir producto al carrito
router.post('/add', isAuthenticated, addToCart);

// Ver el carrito
router.get('/', isAuthenticated, getCart);

// Checkout
router.post('/checkout', isAuthenticated, checkout);

export default router;
