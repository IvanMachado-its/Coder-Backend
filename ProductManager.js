const ProductManager = require('./ProductManager');

const productManager = new ProductManager('products.json');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Obtener un producto por su ID
exports.getProductById = async (req, res) => {
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
};

// Agregar un nuevo producto
exports.addProduct = async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;
    const newProduct = await productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      thumbnails
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;
    const updatedProduct = await productManager.updateProduct(productId, {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      thumbnails
    });
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const deletedProduct = await productManager.deleteProduct(productId);
    if (deletedProduct) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
