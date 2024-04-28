const express = require('express');
const router = express.Router();
const Producto = require('../dao/models/Product'); // Importar el modelo de producto de MongoDB

// Middleware para validar la estructura del producto
const validarProducto = (req, res, next) => {
  const { titulo, descripcion, codigo } = req.body;
  if (!titulo || !descripcion || !codigo) {
    return res.status(400).json({ error: 'Se requieren título, descripción y código' });
  }
  next();
};

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener un producto por su ID
router.get('/:pid', async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const producto = await Producto.findById(idProducto);
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

// Crear un nuevo producto
router.post('/', validarProducto, async (req, res) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json({ id: nuevoProducto.id, mensaje: 'Producto creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const productoActualizado = req.body;
    const producto = await Producto.findByIdAndUpdate(idProducto, productoActualizado, { new: true });
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

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const productoEliminado = await Producto.findByIdAndDelete(idProducto);
    if (productoEliminado) {
      res.json({ mensaje: 'Producto eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
