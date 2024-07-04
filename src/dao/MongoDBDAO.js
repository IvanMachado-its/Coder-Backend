const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Ticket = require('../models/Ticket');

class MongoDBDAO {
  async createUser(userData) {
    return new User(userData).save();
  }

  async findUserById(userId) {
    return User.findById(userId);
  }

  async findUserByEmail(email) {
    return User.findOne({ email });
  }

  async createProduct(productData) {
    return new Product(productData).save();
  }

  async findProductById(productId) {
    return Product.findById(productId);
  }

  async createCart(cartData) {
    return new Cart(cartData).save();
  }

  async findCartByUserId(userId) {
    return Cart.findOne({ userId });
  }

  async createTicket(ticketData) {
    return new Ticket(ticketData).save();
  }
}

module.exports = new MongoDBDAO();
