const CartManager = require('./CartManager');

const cartManager = new CartManager('cart.json');

// Crear un nuevo carrito
exports.createCart = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener productos de un carrito por su ID
exports.getCartById = async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Agregar un producto a un carrito
exports.addProductToCart = async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1; // Default quantity is 1
    const addedProduct = await cartManager.addProductToCart(cartId, productId, quantity);
    if (addedProduct) {
      res.status(201).json(addedProduct);
    } else {
      res.status(404).json({ error: 'Cart or product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
