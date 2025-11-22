const express = require('express');
const router = express.Router();
const prisma = require('../db');

router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    const brands = await prisma.brand.findMany({
      where: category ? { category: { name: category } } : {},
      orderBy: { name: 'asc' },
    });
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

module.exports = router;
