module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 85,
      statements: 85
    }
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/tests/",
    "/src/config/",
    "/src/prisma/"
  ],
  transform: {
    "^.+\\.js$": "babel-jest"
  }
};
