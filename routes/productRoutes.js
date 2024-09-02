import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';
import { createProduct, updateProduct, deleteProduct, renderProducts } from '../controllers/productController.js';

const router = express.Router();

// Mostrar todos los productos
router.get('/', (req, res, next) => renderProducts(req, res, next, 'products', 'Productos'));

// Crear un nuevo producto
router.post('/', isAuthenticated, isAdmin, createProduct);

// Editar un producto
router.put('/:id', isAuthenticated, isAdmin, updateProduct);

// Eliminar un producto
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);


export default router;

