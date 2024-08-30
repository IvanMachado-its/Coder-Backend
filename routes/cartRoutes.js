import express from 'express';
import {
    addToCart,
    removeFromCart,
    getCart,
    checkout
} from '../controllers/cartController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', isAuthenticated, addToCart);
router.delete('/:productId', isAuthenticated, removeFromCart);
router.get('/', isAuthenticated, getCart);
router.post('/checkout', isAuthenticated, checkout);

export default router;
