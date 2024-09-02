import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';
import { renderDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', isAuthenticated, isAdmin, renderDashboard);

export default router;
