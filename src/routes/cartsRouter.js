// src/routes/cartsRouter.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { verifyToken } = require('../middleware/authMiddleware');

// Ruta para obtener el carrito del usuario
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
});

// Ruta para agregar un producto al carrito
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { items: { productId, quantity } } },
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error adding to cart' });
  }
});

// Ruta para eliminar un producto del carrito
router.delete('/remove/:itemId', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error removing from cart' });
  }
});

// Ruta para completar el carrito
router.post('/complete', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [] } },
      { new: true }
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error completing cart' });
  }
});

module.exports = router;
