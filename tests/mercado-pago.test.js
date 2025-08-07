const request = require('supertest');
const app = require('../app');

jest.mock('mercadopago', () => {
  const createMock = jest.fn().mockResolvedValue({ id: 'fake_preference_id' });
  return {
    MercadoPagoConfig: jest.fn().mockImplementation(() => ({})),
    Preference: jest.fn().mockImplementation(() => ({ create: createMock })),
  };
});

describe('POST /mercado-pago/create-preference', () => {
  it('should return 400 if items is not an array', async () => {
    const res = await request(app)
      .post('/mercado-pago/create-preference')
      .send({ items: 'invalid' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if items array is empty', async () => {
    const res = await request(app)
      .post('/mercado-pago/create-preference')
      .send({ items: [] });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return preference ID if request is valid', async () => {
    const res = await request(app)
      .post('/mercado-pago/create-preference')
      .send({
        items: [
          { name: 'Test Product', quantity: 1, price: 5000 }
        ]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 'fake_preference_id');
  });
});
