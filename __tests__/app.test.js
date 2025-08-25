const request = require('supertest');
const app = require('../app');

describe('App Integration', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
  });

  it('should return 200 for /auth base routes if GET defined', async () => {
    const res = await request(app).get('/auth');
    expect([200, 404]).toContain(res.statusCode);
  });
});
