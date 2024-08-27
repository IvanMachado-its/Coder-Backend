// src/pages/ProductPage.js
import React from 'react';
import ProductDetail from '../components/ProductDetail';

const ProductPage = ({ addToCart }) => {
  return (
    <div>
      <ProductDetail addToCart={addToCart} />
    </div>
  );
}

export default ProductPage;
