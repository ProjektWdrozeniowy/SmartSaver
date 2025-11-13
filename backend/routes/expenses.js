const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const CreateExpenseSchema = z.object({
  name: z.string().min(1).max(100),
  categoryId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().positive(),
  description: z.string().optional()
});

const UpdateExpenseSchema = z.object({
  name: z.string().min(1).max(100),
  categoryId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().positive(),
  description: z.string().optional()
});

// GET /api/expenses - Get all expenses for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { month } = req.query;
    const where = { userId: req.user.id };

    // Filter by month if provided (format: YYYY-MM)
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      where.date = {
        gte: startDate,
        lt: endDate
      };
    }

    const expenses = await prisma.expense.findMany({
      where,
      select: {
        id: true,
        name: true,
        categoryId: true,
        date: true,
        description: true,
        amount: true
      },
      orderBy: { date: 'desc' }
    });

    res.json({ expenses });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// POST /api/expenses - Create a new expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, categoryId, date, amount, description } = CreateExpenseSchema.parse(req.body);

    // Verify that the category exists and belongs to the user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: req.user.id
      }
    });

    if (!category) {
      return res.status(400).json({ message: 'Nieprawidłowa kategoria' });
    }

    const expense = await prisma.expense.create({
      data: {
        userId: req.user.id,
        name,
        categoryId,
        date: new Date(date),
        amount,
        description: description || null
      }
    });

    res.status(201).json({
      message: 'Wydatek został dodany',
      expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// PUT /api/expenses/:id - Update an expense
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const expenseId = parseInt(req.params.id);
    const { name, categoryId, date, amount, description } = UpdateExpenseSchema.parse(req.body);

    // Check if expense exists and belongs to user
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: req.user.id
      }
    });

    if (!expense) {
      return res.status(404).json({ message: 'Wydatek nie został znaleziony' });
    }

    // Verify that the category exists and belongs to the user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: req.user.id
      }
    });

    if (!category) {
      return res.status(400).json({ message: 'Nieprawidłowa kategoria' });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        name,
        categoryId,
        date: new Date(date),
        amount,
        description: description || null
      }
    });

    res.json({
      message: 'Wydatek został zaktualizowany',
      expense: updatedExpense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const expenseId = parseInt(req.params.id);

    // Check if expense exists and belongs to user
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: req.user.id
      }
    });

    if (!expense) {
      return res.status(404).json({ message: 'Wydatek nie został znaleziony' });
    }

    await prisma.expense.delete({
      where: { id: expenseId }
    });

    res.json({ message: 'Wydatek został usunięty' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
