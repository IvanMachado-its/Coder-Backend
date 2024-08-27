const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd'
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
