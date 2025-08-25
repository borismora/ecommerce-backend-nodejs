module.exports = {
  hash: jest.fn(async (pwd, salt) => `hashed_${pwd}`),
  compare: jest.fn(async (pwd, hashed) => hashed === `hashed_${pwd}`),

  hashSync: jest.fn((pwd, salt) => `hashed_${pwd}`),
  compareSync: jest.fn((pwd, hashed) => hashed === `hashed_${pwd}`),
};
