// src/pages/CartPage.js
import React from 'react';
import Cart from '../components/Cart';

const CartPage = ({ cart, removeFromCart }) => {
  return (
    <div>
      <Cart cart={cart} removeFromCart={removeFromCart} />
    </div>
  );
}

export default CartPage;
