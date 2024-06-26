const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userService = require('../services/userService');

// Middleware de autenticación para rutas de usuario
router.use(authMiddleware);

router.post('/cart/:productId', async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  try {
    const cart = await userService.addToCart(userId, productId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/cart/:productId', async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  try {
    const cart = await userService.removeFromCart(userId, productId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/checkout', async (req, res) => {
  const userId = req.user.id;
  const { products, totalPrice } = req.body;
  try {
    const order = await userService.checkout(userId, products, totalPrice);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
