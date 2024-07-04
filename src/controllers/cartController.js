const CartService = require('../services/cartService');

exports.viewCart = async (req, res) => {
  try {
    const cart = await CartService.getCartByUserId(req.user.id);
    res.render('cart/index', { user: req.user, cart });
  } catch (error) {
    res.status(400).render('cart/index', { message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    await CartService.addToCart(req.user.id, productId, quantity);
    res.redirect('/cart');
  } catch (error) {
    res.status(400).render('cart/index', { message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    await CartService.removeFromCart(req.user.id, productId);
    res.redirect('/cart');
  } catch (error) {
    res.status(400).render('cart/index', { message: error.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const result = await CartService.checkout(req.user.id);
    res.render('cart/checkout', { user: req.user, result });
  } catch (error) {
    res.status(400).render('cart/index', { message: error.message });
  }
};
