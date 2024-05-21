const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoosePaginate = require('mongoose-paginate-v2');
const multer = require('multer');
const path = require('path');

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Middleware para validar la estructura del producto
const validarProducto = (req, res, next) => {
  const { title, description, code, price, category } = req.body;
  if (!title || !description || !code || !price || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
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
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para crear un nuevo producto con carga de imagen
router.post('/', upload.array('images', 5), validarProducto, async (req, res) => {
  try {
    const { title, description, code, price, category } = req.body;
    const images = req.files.map(file => file.path);
    const nuevoProducto = await Product.create({ title, description, code, price, category, images });
    res.status(201).json({ id: nuevoProducto.id, message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para actualizar un producto
router.put('/:pid', validarProducto, async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const productoActualizado = req.body;
    const producto = await Product.findByIdAndUpdate(idProducto, productoActualizado, { new: true });
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const productoEliminado = await Product.findByIdAndDelete(idProducto);
    if (productoEliminado) {
      res.json({ message: 'Producto eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
