const ProductManager = require('../models/ProductManager');
const { productsMemory } = require('../memory');

const productManager = new ProductManager(productsMemory);

exports.createProduct = (req, res) => {
  try {
    const newProduct = productManager.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllProducts = (req, res) => {
  try {
    const products = productManager.read();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProductById = (req, res) => {
  try {
    const productId = req.params.id;
    const product = productManager.readOne(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateProduct = (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = productManager.update(productId, req.body);
    if (!updatedProduct) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(updatedProduct);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteProduct = (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = productManager.destroy(productId);
    if (!deletedProduct) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(deletedProduct);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
