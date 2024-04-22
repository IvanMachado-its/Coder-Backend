const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor() {
    this.productsFilePath = path.join(__dirname, 'data', 'products.json');
  }

  async create(productData) {
    try {
      const products = await this.read();
      const newProduct = {
        id: this.generateId(),
        ...productData
      };
      products.push(newProduct);
      await this.save(products);
      return newProduct;
    } catch (error) {
      throw new Error('Error creating product');
    }
  }

  async read() {
    try {
      const data = await fs.readFile(this.productsFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error reading products');
    }
  }

  async readOne(productId) {
    try {
      const products = await this.read();
      return products.find(product => product.id === productId);
    } catch (error) {
      throw new Error('Error reading product');
    }
  }

  async update(productId, productData) {
    try {
      const products = await this.read();
      const index = products.findIndex(product => product.id === productId);
      if (index !== -1) {
        products[index] = { ...products[index], ...productData };
        await this.save(products);
        return products[index];
      }
      throw new Error('Product not found');
    } catch (error) {
      throw new Error('Error updating product');
    }
  }

  async destroy(productId) {
    try {
      let products = await this.read();
      products = products.filter(product => product.id !== productId);
      await this.save(products);
    } catch (error) {
      throw new Error('Error deleting product');
    }
  }

  generateId() {
    return crypto.randomBytes(6).toString('hex');
  }

  async save(products) {
    try {
      await fs.writeFile(this.productsFilePath, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error('Error saving products');
    }
  }
}

module.exports = new ProductManager();
