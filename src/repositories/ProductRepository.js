const DAOFactory = require('../dao/Factory');

class ProductRepository {
  constructor() {
    this.dao = DAOFactory.getDAO();
  }

  async createProduct(productData) {
    return this.dao.createProduct(productData);
  }

  async findProductById(productId) {
    return this.dao.findProductById(productId);
  }
}

module.exports = new ProductRepository();
