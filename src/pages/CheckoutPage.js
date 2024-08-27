// src/pages/CheckoutPage.js
import React from 'react';
import Checkout from '../components/Checkout';

const CheckoutPage = ({ cart }) => {
  return (
    <div>
      <Checkout cart={cart} />
    </div>
  );
}

export default CheckoutPage;
