const Product = require('../models/Product');

async function createProduct(name, price, description, imageUrl) {
  try {
    const newProduct = new Product({ name, price, description, imageUrl });
    await newProduct.save();
    return newProduct;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateProduct(productId, name, price, description, imageUrl) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, { name, price, description, imageUrl }, { new: true });
    return updatedProduct;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function deleteProduct(productId) {
  try {
    await Product.findByIdAndDelete(productId);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
};
