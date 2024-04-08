const { v4: uuidv4 } = require('uuid');

class ProductManager {
  constructor(memory) {
    this.memory = memory;
  }

  create(data) {
    const id = uuidv4();
    const product = { id, ...data };
    this.memory.push(product);
    return product;
  }

  read() {
    return this.memory;
  }

  readOne(id) {
    return this.memory.find(product => product.id === id);
  }

  update(id, data) {
    const index = this.memory.findIndex(product => product.id === id);
    if (index !== -1) {
      this.memory[index] = { ...this.memory[index], ...data };
      return this.memory[index];
    }
    return null;
  }

  destroy(id) {
    const index = this.memory.findIndex(product => product.id === id);
    if (index !== -1) {
      const deletedProduct = this.memory.splice(index, 1);
      return deletedProduct[0];
    }
    return null;
  }
}

module.exports = ProductManager;
