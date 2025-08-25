const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../../db');
const authRouter = require('../../routes/auth');

jest.mock('../../db', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));


const app = express();
app.use(express.json());
app.use('/auth', authRouter);

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app).post('/auth/register').send({ email: '' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });

    it('should return 409 if user already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@example.com' });
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: '123456', name: 'Test' });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('User already exists');
    });

    it('should return 400 if password is too short', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: '123', name: 'Test' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Password must be at least 6 characters long');
    });

    it('should create user and return token', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 1, email: 'test@example.com', name: 'Test' });
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: '123456', name: 'Test' });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.user.email).toBe('test@example.com');
      expect(typeof res.body.token).toBe('string');
      // Verify token
      const decoded = jwt.verify(res.body.token, JWT_SECRET);
      expect(decoded.userId).toBe(1);
    });

    it('should return 500 on unexpected error', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('DB error'));
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: '123456', name: 'Test' });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('User registration failed');
    });
  });

  describe('POST /auth/login', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app).post('/auth/login').send({ email: '' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });

    it('should return 404 if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'notfound@example.com', password: '123456' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found');
    });

    it('should return 401 if password is invalid', async () => {
      const hashed = await bcrypt.hash('correctpassword', 10);
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@example.com', password: hashed, name: 'Test' });
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid password');
    });

    it('should login and return token', async () => {
      const password = 'correctpassword';
      const hashed = await bcrypt.hash(password, 10);
      prisma.user.findUnique.mockResolvedValue({ id: 2, email: 'test2@example.com', password: hashed, name: 'Tester' });
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test2@example.com', password });
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('test2@example.com');
      expect(typeof res.body.token).toBe('string');
      const decoded = jwt.verify(res.body.token, JWT_SECRET);
      expect(decoded.userId).toBe(2);
    });

    it('should return 500 on unexpected error', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('DB error'));
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: '123456' });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Login failed');
    });
  });
});

// We recommend installing an extension to run jest tests.
