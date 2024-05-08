const express = require('express');
const fs = require('fs').promises;
const router = express.Router();

class Cart {
  constructor() {
    this.id = Date.now().toString(); // Autogenerar ID único
    this.products = [];
  }
}

// Endpoint para crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = new Cart();
    const data = await fs.readFile('carts.json', 'utf8');
    const carts = JSON.parse(data);
    carts.push(newCart);
    await fs.writeFile('carts.json', JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para obtener un carrito por su ID
router.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const data = await fs.readFile('carts.json', 'utf8');
    const carts = JSON.parse(data);
    const cart = carts.find(cart => cart.id === cartId);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const data = await fs.readFile('carts.json', 'utf8');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId);
      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity++;
      } else {
        carts[cartIndex].products.push({ id: productId, quantity: 1 });
      }
      await fs.writeFile('carts.json', JSON.stringify(carts, null, 2));
      res.json(carts[cartIndex]);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const data = await fs.readFile('carts.json', 'utf8');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId);
      if (productIndex !== -1) {
        carts[cartIndex].products.splice(productIndex, 1);
        await fs.writeFile('carts.json', JSON.stringify(carts, null, 2));
        res.json(carts[cartIndex]);
      } else {
        res.status(404).json({ error: 'Product not found in cart' });
      }
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body; // Nueva cantidad del producto
    const data = await fs.readFile('carts.json', 'utf8');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId);
      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity = quantity;
        await fs.writeFile('carts.json', JSON.stringify(carts, null, 2));
        res.json(carts[cartIndex]);
      } else {
        res.status(404).json({ error: 'Product not found in cart' });
      }
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const data = await fs.readFile('carts.json', 'utf8');
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex !== -1) {
      carts[cartIndex].products = []; // Eliminar todos los productos del carrito
      await fs.writeFile('carts.json', JSON.stringify(carts, null, 2));
      res.json(carts[cartIndex]);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
