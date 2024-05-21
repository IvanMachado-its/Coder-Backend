// src/routes/cartsRouter.js

const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Obtener el carrito del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.session.user._id, status: 'active' }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ error: 'No active cart found' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Agregar un producto al carrito
router.post('/add', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.session.user._id, status: 'active' });

    if (!cart) {
      cart = new Cart({ user: req.session.user._id, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const cartItem = cart.items.find(item => item.product.equals(productId));
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Eliminar un producto del carrito
router.delete('/remove/:itemId', authMiddleware, async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.session.user._id, status: 'active' });
    if (!cart) {
      return res.status(404).json({ error: 'No active cart found' });
    }

    cart.items.id(itemId).remove();
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Completar el carrito
router.post('/complete', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.session.user._id, status: 'active' },
      { status: 'completed' },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ error: 'No active cart found' });
    }

    res.json({ message: 'Cart completed successfully' });
  } catch (error) {
    console.error('Error completing cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
