const express = require('express');
const router = express.Router();
const prisma = require('../db');

router.get('/', async (req, res) => {
  const { category, brand, search, page = 1, limit = 12 } = req.query;

  const filters = {};

  if (category && category.trim() !== '') filters.category = category;
  if (brand && brand.trim() !== '') filters.brand = brand;

  if (search && search.trim() !== '') {
    filters.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  const take = parseInt(limit, 10);
  const skip = (parseInt(page, 10) - 1) * take;

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: filters }),
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      page: parseInt(page, 10),
      totalPages,
      totalProducts: total,
      limit: take,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
