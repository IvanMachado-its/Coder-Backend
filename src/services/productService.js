// src/services/productService.js

const Product = require('../models/Product');

async function create(productData) {
  const newProduct = new Product(productData);
  return await newProduct.save();
}

async function read() {
  return await Product.find();
}

module.exports = {
  create,
  read
};
