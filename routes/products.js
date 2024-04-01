const express = require('express');
const fs = require('fs').promises;

class Product {
  constructor({ title, description, code, price, status = true, stock = 0, category, thumbnails = [] }) {
    this.id = Date.now().toString(); // Autogenerar ID único
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnails = thumbnails;
  }
}

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile('products.json', 'utf8');
    const products = JSON.parse(data);
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const limitedProducts = limit ? products.slice(0, limit) : products;
    res.json(limitedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const data = await fs.readFile('products.json', 'utf8');
    const products = JSON.parse(data);
    const product = products.find(product => product.id === productId);
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

router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const data = await fs.readFile('products.json', 'utf8');
    const products = JSON.parse(data);
    products.push(newProduct);
    await fs.writeFile('products.json', JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const data = await fs.readFile('products.json', 'utf8');
    let products = JSON.parse(data);
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct, id: productId };
      await fs.writeFile('products.json', JSON.stringify(products, null, 2));
      res.json(products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const data = await fs.readFile('products.json', 'utf8');
    let products = JSON.parse(data);
    const index = products.findIndex(product => product.id === productId);
    if (index !== -1) {
      products.splice(index, 1);
      await fs.writeFile('products.json', JSON.stringify(products, null, 2));
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
