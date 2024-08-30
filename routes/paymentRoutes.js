import express from 'express';
import { processPayment } from '../controllers/paymentController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', isAuthenticated, processPayment);

export default router;
