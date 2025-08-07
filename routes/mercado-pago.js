const express = require('express');
const router = express.Router();
const { client, Preference } = require('../mercado-pago');

router.post('/create-preference', async (req, res) => {
  try {
    const { items } = req.body;
    const FRONTEND_URL = process.env.FRONTEND_URL;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'The "items" field must be a non-empty array.' });
    }

    const preferenceData = {
      items: items.map(item => ({
        title: item.name,
        quantity: item.quantity,
        currency_id: 'CLP',
        unit_price: item.price,
      })),
      back_urls: {
        success: `${FRONTEND_URL}/order-summary`,
        failure: `${FRONTEND_URL}/checkout`,
      }
    };

    const preference = new Preference(client);
    const response = await preference.create({ body: preferenceData });

    res.json({ id: response.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create preference' });
  }
});

router.post('/process-payment', async (req, res) => {
  try {
    const paymentData = req.body;
    console.log('Payment received:', paymentData);
    res.status(200).json({ status: 'received' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

module.exports = router;
