const crypto = require('crypto');

class Producto {
  constructor({ titulo, descripcion, precio }) {
    this.id = this.generateUniqueId();
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.precio = precio;
  }

  generateUniqueId() {
    return crypto.randomBytes(6).toString('hex'); // Generar un ID único basado en bytes aleatorios
  }
}

class ProductManager {
  constructor() {
    this.productos = [];
    this.deletedIds = new Set(); // Conjunto para almacenar IDs eliminados
  }

  create(producto) {
    const nuevoProducto = new Producto(producto);
    this.productos.push(nuevoProducto);
    return nuevoProducto;
  }

  read() {
    return this.productos;
  }

  readOne(id) {
    return this.productos.find(producto => producto.id === id);
  }

  update(id, newData) {
    const index = this.productos.findIndex(producto => producto.id === id);
    if (index !== -1) {
      this.productos[index] = { ...this.productos[index], ...newData };
      return this.productos[index];
    }
    return null;
  }

  destroy(id) {
    const index = this.productos.findIndex(producto => producto.id === id);
    if (index !== -1) {
      this.productos.splice(index, 1);
      this.deletedIds.add(id); // Agregar el ID eliminado al conjunto
      return true;
    }
    return false;
  }

  generateNewId() {
    let id;
    do {
      id = crypto.randomBytes(6).toString('hex');
    } while (this.deletedIds.has(id)); // Verificar si el nuevo ID ya ha sido eliminado
    return id;
  }
}

module.exports = ProductManager;
