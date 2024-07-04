const DAOFactory = require('../dao/Factory');

class CartRepository {
  constructor() {
    this.dao = DAOFactory.getDAO();
  }

  async createCart(cartData) {
    return this.dao.createCart(cartData);
  }

  async findCartByUserId(userId) {
    return this.dao.findCartByUserId(userId);
  }
}

module.exports = new CartRepository();
