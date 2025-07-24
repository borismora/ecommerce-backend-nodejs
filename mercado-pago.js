require('dotenv').config();
const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

console.log("MercadoPago correct configured");

module.exports = { client, Preference };
