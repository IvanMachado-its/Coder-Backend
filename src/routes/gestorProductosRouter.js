const express = require('express');
const router = express.Router();
const gestorProductos = require('./gestorProductos');

// Middleware para validar propiedades obligatorias
const validarPropiedadesProducto = (req, res, next) => {
  const { titulo, precio } = req.body;
  if (!titulo || !precio) {
    return res.status(400).json({ error: 'El título y el precio son obligatorios' });
  }
  next();
};

// Endpoint POST para crear un producto
router.post('/', validarPropiedadesProducto, async (req, res) => {
  try {
    const nuevoProducto = await gestorProductos.create(req.body);
    res.status(201).json({ id: nuevoProducto.id, mensaje: 'Producto creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint GET para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await gestorProductos.read();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint GET para obtener un producto por su ID
router.get('/:idProducto', async (req, res) => {
  try {
    const idProducto = req.params.idProducto;
    const producto = await gestorProductos.readOne(idProducto);
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint PUT para actualizar un producto por su ID
router.put('/:idProducto', validarPropiedadesProducto, async (req, res) => {
  try {
    const idProducto = req.params.idProducto;
    const productoActualizado = await gestorProductos.update(idProducto, req.body);
    res.status(200).json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint DELETE para eliminar un producto por su ID
router.delete('/:idProducto', async (req, res) => {
  try {
    const idProducto = req.params.idProducto;
    await gestorProductos.destroy(idProducto);
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
