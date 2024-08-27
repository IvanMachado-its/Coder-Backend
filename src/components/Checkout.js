// src/components/Checkout.js
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('tu_clave_publica_de_stripe'); // Reemplaza con tu clave pública

const CheckoutForm = ({ totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      'tu_client_secret', { // Este client_secret se debe obtener desde el backend
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message);
    } else if (paymentIntent.status === 'succeeded') {
      setPaymentSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || paymentSuccess}>
        Pay ${totalPrice}
      </button>
      {error && <div>{error}</div>}
      {paymentSuccess && <div>Payment successful!</div>}
    </form>
  );
};

const Checkout = ({ cart }) => {
  const totalPrice = cart.reduce((total, product) => total + product.price, 0);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm totalPrice={totalPrice} />
    </Elements>
  );
};

export default Checkout;
