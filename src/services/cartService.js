const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCartByUserId = async (userId) => {
  return await Cart.findOne({ user: userId }).populate('products.product');
};

exports.addToCart = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  const product = await Product.findById(productId);
  if (!cart) {
    const newCart = new Cart({
      user: userId,
      products: [{ product: productId, quantity }]
    });
    return await newCart.save();
  } else {
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    return await cart.save();
  }
};

exports.removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  cart.products = cart.products.filter(p => p.product.toString() !== productId);
  return await cart.save();
};

exports.checkout = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('products.product');
  let totalAmount = 0;
  const productsOutOfStock = [];

  for (const item of cart.products) {
    if (item.product.stock >= item.quantity) {
      item.product.stock -= item.quantity;
      await item.product.save();
      totalAmount += item.product.price * item.quantity;
    } else {
      productsOutOfStock.push(item.product._id);
    }
  }

  cart.products = cart.products.filter(item => productsOutOfStock.includes(item.product._id));
  await cart.save();

  return { totalAmount, productsOutOfStock };
};
