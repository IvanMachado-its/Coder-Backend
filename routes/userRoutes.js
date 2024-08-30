import express from 'express';
import {
    getUsers,
    deleteInactiveUsers,
    updateUserRole,
    deleteUser
} from '../controllers/userController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getUsers);
router.delete('/', isAdmin, deleteInactiveUsers);
router.put('/:id/role', isAdmin, updateUserRole);
router.delete('/:id', isAdmin, deleteUser);

export default router;
