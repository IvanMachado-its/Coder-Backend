// ProductManager.js

const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error loading products:', error);
      throw new Error('Failed to load products');
    }
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving products:', error);
      throw new Error('Failed to save products');
    }
  }

  async addProduct(product) {
    try {
      // Realizar validaciones adicionales aquí antes de agregar el producto
      this.products.push(product);
      await this.saveProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
  }

  async updateProduct(productId, updatedProductData) {
    try {
      // Encontrar el índice del producto a actualizar
      const index = this.products.findIndex(product => product.id === productId);
      if (index !== -1) {
        // Actualizar el producto con los nuevos datos
        this.products[index] = { ...this.products[index], ...updatedProductData };
        await this.saveProducts();
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(productId) {
    try {
      // Filtrar el producto a eliminar
      this.products = this.products.filter(product => product.id !== productId);
      await this.saveProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  // Implementar métodos para obtener productos, etc.
}

module.exports = ProductManager;
