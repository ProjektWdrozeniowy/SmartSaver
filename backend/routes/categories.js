const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string().min(1)
});

// GET /api/categories - Get all categories for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        name: true,
        color: true,
        icon: true
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// POST /api/categories - Create a new category
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, color, icon } = CreateCategorySchema.parse(req.body);

    // Check if category with this name already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: {
        userId: req.user.id,
        name: name
      }
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Kategoria o tej nazwie już istnieje' });
    }

    const category = await prisma.category.create({
      data: {
        userId: req.user.id,
        name,
        color,
        icon
      }
    });

    res.status(201).json({
      message: 'Kategoria została dodana',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// DELETE /api/categories/:id - Delete a category
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    // Check if category exists and belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: req.user.id
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Kategoria nie została znaleziona' });
    }

    // Check if there are expenses using this category
    const expenseCount = await prisma.expense.count({
      where: { categoryId: categoryId }
    });

    if (expenseCount > 0) {
      return res.status(400).json({
        message: 'Nie można usunąć kategorii, która jest używana przez wydatki'
      });
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    res.json({ message: 'Kategoria została usunięta' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
