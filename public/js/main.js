const stripe = Stripe('your-publishable-key-here');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
    });

    if (error) {
        console.error(error);
    } else {
        const paymentMethodId = paymentMethod.id;

        const response = await fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentMethodId }),
        });

        const data = await response.json();

        if (data.error) {
            console.error(data.error);
        } else {
            window.location.href = '/thank-you';
        }
    }
});
