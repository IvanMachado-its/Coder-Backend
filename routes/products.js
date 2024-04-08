// products.js

const express = require('express');
const fs = require('fs').promises;

class Producto {
  constructor({ titulo, descripcion, codigo, precio, estado = true, stock = 0, categoria, imagenes = [] }) {
    this.id = Date.now().toString(16); // Generar un ID único basado en la fecha
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.codigo = codigo;
    this.precio = precio;
    this.estado = estado;
    this.stock = stock;
    this.categoria = categoria;
    this.imagenes = imagenes;
  }
}

const router = express.Router();

// Middleware para validar las propiedades requeridas en el cuerpo de la solicitud
const validarProducto = (req, res, next) => {
  const { titulo, descripcion, codigo } = req.body;
  if (!titulo || !descripcion || !codigo) {
    return res.status(400).json({ error: 'Se requieren título, descripción y código' });
  }
  next();
};

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile('productos.json', 'utf8');
    const productos = JSON.parse(data);
    const limite = req.query.limite ? parseInt(req.query.limite) : undefined;
    const productosLimitados = limite ? productos.slice(0, limite) : productos;
    res.json(productosLimitados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const data = await fs.readFile('productos.json', 'utf8');
    const productos = JSON.parse(data);
    const producto = productos.find(producto => producto.id === idProducto);
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

router.post('/', validarProducto, async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    const data = await fs.readFile('productos.json', 'utf8');
    const productos = JSON.parse(data);
    productos.push(nuevoProducto);
    await fs.writeFile('productos.json', JSON.stringify(productos, null, 2));
    res.status(201).json({ id: nuevoProducto.id, mensaje: 'Producto creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const productoActualizado = req.body;
    const data = await fs.readFile('productos.json', 'utf8');
    let productos = JSON.parse(data);
    const indice = productos.findIndex(producto => producto.id === idProducto);
    if (indice !== -1) {
      productos[indice] = { ...productos[indice], ...productoActualizado, id: idProducto };
      await fs.writeFile('productos.json', JSON.stringify(productos, null, 2));
      res.json(productos[indice]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const data = await fs.readFile('productos.json', 'utf8');
    let productos = JSON.parse(data);
    const indice = productos.findIndex(producto => producto.id === idProducto);
    if (indice !== -1) {
      productos.splice(indice, 1);
      await fs.writeFile('productos.json', JSON.stringify(productos, null, 2));
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
