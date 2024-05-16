const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Importar el modelo de producto de MongoDB
const mongoosePaginate = require('mongoose-paginate-v2'); // Importar mongoose-paginate-v2

// Middleware para validar la estructura del producto
const validarProducto = (req, res, next) => {
  const { title, description, code } = req.body;
  if (!title || !description || !code) {
    return res.status(400).json({ error: 'Title, description, and code are required' });
  }
  next();
};

// Middleware para verificar la autenticación del usuario
const verificarAutenticacion = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Obtener todos los productos con paginación
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page), 
      limit: parseInt(limit),
    };
    const productos = await Product.paginate({}, options); 
    res.json(productos); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
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
router.post('/', verificarAutenticacion, validarProducto, async (req, res) => {
  try {
    const nuevoProducto = await Product.create(req.body);
    res.status(201).json({ id: nuevoProducto.id, message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para actualizar un producto
router.put('/:pid', verificarAutenticacion, async (req, res) => {
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
router.delete('/:pid', verificarAutenticacion, async (req, res) => {
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
