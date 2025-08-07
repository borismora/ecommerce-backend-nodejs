const request = require('supertest');
const app = require('../../app');
const { faker } = require('@faker-js/faker');

const testUser = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
};

describe('Auth endpoints', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/auth/register').send(testUser);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('userId');
    });

    it('should fail to register duplicate user', async () => {
      const res = await request(app).post('/auth/register').send(testUser);
      expect(res.statusCode).toBe(500);
    });

    it('should fail to register with missing email', async () => {
      const res = await request(app).post('/auth/register').send({
        name: faker.person.fullName(),
        password: faker.internet.password()
      });
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail to login with invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrongpassword' });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid password');
    });

    it('should fail to login with non-existent user', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'anypassword'
      });
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return a valid JWT token', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      const token = res.body.token;
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });
  });
});
