# E-commerce Backend with Node.js & MercadoPago

This is a simple backend project built with **Node.js** and **Express**, designed to handle MercadoPago payment integration for an e-commerce application. It provides an endpoint to create MercadoPago payment preferences.

## 🚀 Features

- Node.js + Express backend
- MercadoPago integration (Brick SDK)
- RESTful API
- Environment configuration with `.env`
- CORS enabled for frontend integration

## 🛠️ Technologies

- Node.js
- Express.js
- MercadoPago SDK
- dotenv

## 📁 Project Structure

```
backend-nodejs/
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following content:

```bash
MP_ACCESS_TOKEN=your_mercadopago_access_token
PORT=4000
```

> You can get your credentials from [https://www.mercadopago.cl/developers/panel](https://www.mercadopago.cl/developers/panel)

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/borismora/ecommerce-backend-nodejs.git
cd ecommerce-backend-nodejs
```

2. Install dependencies:

```bash
npm install
```

3. Create the `.env` file as described above.

4. Start the server:

```bash
npm start
```

The server will run on `http://localhost:4000` by default.

## 📡 API Endpoint

### POST `/create_preference`

Creates a new payment preference.

#### Request Body:

```json
{
  "title": "Product name",
  "quantity": 1,
  "unit_price": 10000,
  "currency_id": "CLP"
}
```

#### Response:

```json
{
  "id": "<preference_id>"
}
```

## 💡 Notes

- Use this backend with your React frontend project to handle MercadoPago Brick payments.
- The `/create_preference` route can be extended to include user data, authentication, and database interaction.

## 🧪 Testing

You can test the `/create_preference` endpoint using Postman or curl:

```bash
curl -X POST http://localhost:4000/create_preference \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Sample Product",
       "quantity": 1,
       "unit_price": 10000,
       "currency_id": "CLP"
     }'
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with 💻 by [borismora](https://github.com/borismora)

