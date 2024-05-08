const express = require('express');
const router = express.Router();
const Product = require('../dao/models/Product');

// Middleware para validar la estructura del producto
const validarProducto = (req, res, next) => {
  const { title, description, code } = req.body;
  if (!title || !description || !code) {
    return res.status(400).json({ error: 'Title, description, and code are required' });
  }
  next();
};

// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const producto = await Product.findById(idProducto);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para crear un nuevo producto
router.post('/', validarProducto, async (req, res) => {
  try {
    const nuevoProducto = await Product.create(req.body);
    res.status(201).json({ id: nuevoProducto.id, message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para actualizar un producto
router.put('/:pid', async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const productoActualizado = req.body;
    const producto = await Product.findByIdAndUpdate(idProducto, productoActualizado, { new: true });
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const productoEliminado = await Product.findByIdAndDelete(idProducto);
    if (productoEliminado) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
