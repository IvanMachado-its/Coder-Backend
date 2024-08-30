import express from 'express';
import { renderDashboard } from '../controllers/dashboardController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protege la ruta del dashboard con autenticación
router.get('/dashboard', isAuthenticated, renderDashboard);

export default router;
