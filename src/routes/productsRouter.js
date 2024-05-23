// src/routes/productsRouter.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const authenticateToken = require('../middleware/authMiddleware');

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

// Obtener todos los productos con paginación y filtros
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = query ? { $or: [{ category: query }, { availability: query }] } : {};
    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOption
    };

    const result = await Product.paginate(filter, options);

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.page - 1 : null,
      nextPage: result.hasNextPage ? result.page + 1 : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.page + 1}&sort=${sort}&query=${query}` : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener un producto por su ID
router.get('/:pid', authenticateToken, async (req, res) => {
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
router.post('/', authenticateToken, upload.array('images', 5), validarProducto, async (req, res) => {
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

// Endpoint para actualizar un producto por su ID
router.put('/:pid', authenticateToken, async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const { title, description, code, price, status, stock, category } = req.body;
    const productoActualizado = await Product.findByIdAndUpdate(
      idProducto,
      { title, description, code, price, status, stock, category },
      { new: true }
    );
    if (productoActualizado) {
      res.json({ id: productoActualizado.id, message: 'Producto actualizado exitosamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para eliminar un producto por su ID
router.delete('/:pid', authenticateToken, async (req, res) => {
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
