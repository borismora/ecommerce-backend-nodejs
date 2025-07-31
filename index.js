require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const mercadoPagoRoutes = require('./routes/mercado-pago');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/mercado-pago', mercadoPagoRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
