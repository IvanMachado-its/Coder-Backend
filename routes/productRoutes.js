// routes/productRoutes.js
import express from 'express';
import { createProduct, updateProduct, deleteProduct, renderProducts } from '../controllers/productController.js';
import { isAuthenticated, isAdminOrPremium } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

// Mostrar todos los productos (acceso público)
router.get('/', (req, res, next) => renderProducts(req, res, next, 'products', 'Productos'));

// Crear un nuevo producto (admin o premium)
router.post('/', isAuthenticated, isAdminOrPremium, createProduct);

// Editar un producto (admin o premium)
router.put('/:id', isAuthenticated, isAdminOrPremium, updateProduct);

// Eliminar un producto (admin o premium)
router.delete('/:id', isAuthenticated, isAdminOrPremium, deleteProduct);

export default router;

