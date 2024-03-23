class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    // Implementación omitida por brevedad
  }

  async getProducts(limit) {
    await this.loadProducts();
    if (limit !== undefined) {
      return this.products.slice(0, limit);
    } else {
      return this.products;
    }
  }

  async getProductById(id) {
    await this.loadProducts();
    const product = this.products.find(product => product.id === id);
    return product;
  }
}

module.exports = ProductManager;
