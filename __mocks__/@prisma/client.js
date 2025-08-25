const bcrypt = require("bcrypt");

let users = [
  {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    password: bcrypt.hashSync("testpassword", 10),
  },
];

module.exports = {
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(({ where: { email } }) => {
        const user = users.find((u) => u.email === email);
        return Promise.resolve(user || null);
      }),
      create: jest.fn(({ data }) => {
        const exists = users.find((u) => u.email === data.email);
        if (exists) {
          return Promise.reject(new Error("Unique constraint failed on the fields: (`email`)"));
        }
        const newUser = {
          id: users.length + 1,
          ...data,
          password: bcrypt.hashSync(data.password, 10),
        };
        users.push(newUser);
        return Promise.resolve(newUser);
      }),
    },
  })),
};
