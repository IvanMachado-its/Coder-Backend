// routes/index.js
import express from 'express';
import { isAuthenticated, isAdmin, isPremiumOrAdmin, isUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas para usuarios no logueados
router.get('/', (req, res) => res.render('index', { title: 'Inicio' }));
router.get('/login', (req, res) => res.render('login', { title: 'Iniciar Sesión' }));
router.get('/register', (req, res) => res.render('register', { title: 'Registro' }));

// Rutas para usuarios con rol 'user'
router.get('/cart', isAuthenticated, isUser, (req, res) => res.render('cart', { title: 'Carrito' }));
router.get('/checkout', isAuthenticated, isUser, (req, res) => res.render('checkout', { title: 'Checkout' }));

// Rutas para usuarios con rol 'premium' o 'admin'
router.get('/dashboard', isAuthenticated, isPremiumOrAdmin, (req, res) => res.render('dashboard', { title: 'Panel de Control' }));

// Rutas exclusivas para 'admin'
router.get('/admin', isAuthenticated, isAdmin, (req, res) => res.render('admin', { title: 'Administración' }));

export default router;
