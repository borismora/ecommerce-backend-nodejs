const request = require('supertest');
const app = require('../../app');

jest.mock('../../db', () => ({

}));

const prisma = require('../../db');

describe('GET /products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and list of products', async () => {

  });
});
