const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1️⃣ Create users
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      },
    });
    users.push(user);
  }

  // 2️⃣ Load products from JSON
  const filePath = path.join(__dirname, 'products.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  const { products } = JSON.parse(rawData);

  console.log(`📦 Loading ${products.length} products from JSON...`);

  // Adapt structure to your Prisma schema
  const createdProducts = [];
  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.title,
        photo: p.thumbnail || (p.images?.[0] ?? null),
        price: Math.round(p.price * 100),
        category: p.category,
        brand: p.brand || 'Generic',
      },
    });
    createdProducts.push(product);
  }

  // 3️⃣ Create orders with order items
  for (let i = 0; i < 5; i++) {
    const user = faker.helpers.arrayElement(users);
    const orderItemsCount = faker.number.int({ min: 1, max: 4 });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalPrice: 0,
      },
    });

    let total = 0;
    for (let j = 0; j < orderItemsCount; j++) {
      const product = faker.helpers.arrayElement(createdProducts);
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = product.price;

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity,
          price,
        },
      });

      total += price * quantity;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { totalPrice: total },
    });
  }

  // Create categories
  const categories = [...new Set(products.map((p) => p.category))];
  for (const categoryName of categories) {
    await prisma.category.create({
      data: { name: categoryName },
    });
  }

  // Create brands
  const brandMap = new Map();
  for (const p of products) {
    const name = p.brand || 'Generic';
    if (!brandMap.has(name)) {
      brandMap.set(name, p.category);
    }
  }

  for (const [name, categoryName] of brandMap) {
    await prisma.brand.create({
      data: {
        name,
        category: {
          connect: { name: categoryName }
        },
      },
    });
  }

  console.log('✅ Seed complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
