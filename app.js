const express = require('express');
const fs = require('fs').promises;
const ProductManager = require('./ProductManager');

const app = express();
const productManager = new ProductManager('products.json');

// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
