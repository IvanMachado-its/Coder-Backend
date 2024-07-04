// src/routes/user.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.extractUserFromToken);

router.get('/profile/:id', userController.getUserById);

module.exports = router;

