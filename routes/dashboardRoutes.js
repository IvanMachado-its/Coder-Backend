// routes/dashboardRoutes.js
import express from 'express';
import { isAuthenticated, isAuthorizedForDashboard } from '../middlewares/authMiddleware.js';
import { renderDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', isAuthenticated, isAuthorizedForDashboard, renderDashboard);

export default router;
