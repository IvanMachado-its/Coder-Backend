import express from 'express';
import { getCart, addToCart, removeFromCart, checkout } from '../controllers/cartController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', isAuthenticated, getCart);
router.post('/add', isAuthenticated, addToCart);
router.post('/remove/:productId', isAuthenticated, removeFromCart);
router.post('/checkout', isAuthenticated, checkout);

export default router;
