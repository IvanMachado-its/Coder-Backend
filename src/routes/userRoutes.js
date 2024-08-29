const express = require('express');
const router = express.Router();
const { getAllUsers, deleteInactiveUsers, getUserById, updateUserRole, deleteUser } = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Obtener todos los usuarios (solo admin)
router.get('/', isAuthenticated, isAdmin, getAllUsers);

// Eliminar usuarios inactivos (solo admin)
router.delete('/inactive', isAuthenticated, isAdmin, deleteInactiveUsers);

// Obtener un usuario por ID
router.get('/:id', isAuthenticated, getUserById);

// Modificar el rol de un usuario (solo admin)
router.put('/:id/role', isAuthenticated, isAdmin, updateUserRole);

// Eliminar un usuario (solo admin)
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);

module.exports = router;
