import express from 'express';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProducts
} from '../controllers/productController.js';
import { isAdmin, isPremiumUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', isPremiumUser, createProduct);
router.put('/:id', isPremiumUser, updateProduct);
router.delete('/:id', isPremiumUser, deleteProduct);
router.get('/:id', getProductById);
router.get('/', getProducts);

export default router;
