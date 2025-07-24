require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { client, Preference } = require('./mercado-pago');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create_preference', async (req, res) => {
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

app.post('/process_payment', async (req, res) => {
  try {
    const paymentData = req.body;
    // Here you would typically process the payment data
    console.log('Payment received:', paymentData);
    res.status(200).json({ status: 'received' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
