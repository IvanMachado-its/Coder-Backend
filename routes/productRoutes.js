import express from 'express';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProducts
} from '../controllers/productController.js';
import { isAuthenticated, isPremiumUser } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/', isAuthenticated, isPremiumUser, createProduct);
router.put('/:id', isAuthenticated, isPremiumUser, updateProduct);
router.delete('/:id', isAuthenticated, isPremiumUser, deleteProduct);

// Rutas públicas para ver productos
router.get('/:id', getProductById);
router.get('/', getProducts);

export default router;
