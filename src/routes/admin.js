const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminService = require('../services/adminService');

// Middleware de autenticación para rutas de administrador
router.use(authMiddleware);

router.post('/products', async (req, res) => {
  const { name, price, description, imageUrl } = req.body;
  try {
    const product = await adminService.createProduct(name, price, description, imageUrl);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { name, price, description, imageUrl } = req.body;
  try {
    const updatedProduct = await adminService.updateProduct(productId, name, price, description, imageUrl);
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    await adminService.deleteProduct(productId);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
