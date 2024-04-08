// usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);
router.get('/:uid', usersController.getUserById);
router.put('/:uid', usersController.updateUser);
router.delete('/:uid', usersController.deleteUser);

module.exports = router;
