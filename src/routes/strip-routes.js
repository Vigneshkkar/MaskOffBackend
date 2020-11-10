const StripRouter = require('express').Router();

const stripe = require('stripe')(process.env.STRIP_KEY);
console.log(process.env.STRIP_KEY);

StripRouter.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: 'vigneshkkar@gmail.com',
    success_url: 'http://localhost:3000/Home/OrderConfirmation/success',
    cancel_url: 'http://localhost:3000/Home/OrderConfirmation/fail',
  });

  res.json({ id: session.id });
});

StripRouter.post('/secret', async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: 'cad',
      // Verify your integration in this guide by including this parameter
      metadata: { integration_check: 'accept_a_payment' },
    });

    res.json({ client_secret: intent.client_secret }); // ... Fetch or create the PaymentIntent
  } catch (e) {
    res.status(500).json('Cannnot Initialize the Payment');
  }
});

module.exports = StripRouter;
