// src/components/Cart.js
import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cart, removeFromCart }) => {
  const totalPrice = cart.reduce((total, product) => total + product.price, 0);

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.length === 0 && <p>Your cart is empty</p>}
      {cart.map(product => (
        <div key={product._id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
          <button onClick={() => removeFromCart(product._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${totalPrice}</h3>
      <Link to="/checkout">
        <button>Proceed to Checkout</button>
      </Link>
    </div>
  );
}

export default Cart;
