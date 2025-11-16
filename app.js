require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const mercadoPagoRoutes = require('./routes/mercado-pago');
const categoriesRoutes = require('./routes/categories');
const brandsRoutes = require('./routes/brands');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/mercado-pago', mercadoPagoRoutes);
app.use('/categories', categoriesRoutes);
app.use('/brands', brandsRoutes);

module.exports = app;
