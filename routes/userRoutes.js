import express from 'express';
import {
    getUsers,
    deleteInactiveUsers,
    updateUserRole,
    deleteUser
} from '../controllers/userController.js';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/', isAuthenticated, isAdmin, getUsers);
router.delete('/', isAuthenticated, isAdmin, deleteInactiveUsers);
router.put('/:id/role', isAuthenticated, isAdmin, updateUserRole);
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);

export default router;
