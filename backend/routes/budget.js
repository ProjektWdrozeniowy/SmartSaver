const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const CreateIncomeSchema = z.object({
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().optional()
});

const UpdateIncomeSchema = z.object({
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().optional()
});

// GET /api/budget/income - Get all incomes for the authenticated user
router.get('/income', authenticateToken, async (req, res) => {
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

    const incomes = await prisma.income.findMany({
      where,
      select: {
        id: true,
        name: true,
        amount: true,
        date: true,
        description: true
      },
      orderBy: { date: 'desc' }
    });

    res.json({ incomes });
  } catch (error) {
    console.error('Get incomes error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// POST /api/budget/income - Create a new income
router.post('/income', authenticateToken, async (req, res) => {
  try {
    const { name, amount, date, description } = CreateIncomeSchema.parse(req.body);

    const income = await prisma.income.create({
      data: {
        userId: req.user.id,
        name,
        amount,
        date: new Date(date),
        description: description || null
      }
    });

    res.status(201).json({
      message: 'Przychód został dodany',
      income
    });
  } catch (error) {
    console.error('Create income error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// PUT /api/budget/income/:id - Update an income
router.put('/income/:id', authenticateToken, async (req, res) => {
  try {
    const incomeId = parseInt(req.params.id);
    const { name, amount, date, description } = UpdateIncomeSchema.parse(req.body);

    // Check if income exists and belongs to user
    const income = await prisma.income.findFirst({
      where: {
        id: incomeId,
        userId: req.user.id
      }
    });

    if (!income) {
      return res.status(404).json({ message: 'Przychód nie został znaleziony' });
    }

    const updatedIncome = await prisma.income.update({
      where: { id: incomeId },
      data: {
        name,
        amount,
        date: new Date(date),
        description: description || null
      }
    });

    res.json({
      message: 'Przychód został zaktualizowany',
      income: updatedIncome
    });
  } catch (error) {
    console.error('Update income error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// DELETE /api/budget/income/:id - Delete an income
router.delete('/income/:id', authenticateToken, async (req, res) => {
  try {
    const incomeId = parseInt(req.params.id);

    // Check if income exists and belongs to user
    const income = await prisma.income.findFirst({
      where: {
        id: incomeId,
        userId: req.user.id
      }
    });

    if (!income) {
      return res.status(404).json({ message: 'Przychód nie został znaleziony' });
    }

    await prisma.income.delete({
      where: { id: incomeId }
    });

    res.json({ message: 'Przychód został usunięty' });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// GET /api/budget/summary - Get budget summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { month } = req.query;

    // Default to current month if not provided
    const targetMonth = month || new Date().toISOString().slice(0, 7);

    if (!/^\d{4}-\d{2}$/.test(targetMonth)) {
      return res.status(400).json({ message: 'Nieprawidłowy format miesiąca (wymagany: YYYY-MM)' });
    }

    const startDate = new Date(`${targetMonth}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Get incomes for the month
    const incomesResult = await prisma.income.aggregate({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lt: endDate
        }
      },
      _sum: {
        amount: true
      }
    });

    // Get expenses for the month
    const expensesResult = await prisma.expense.aggregate({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lt: endDate
        }
      },
      _sum: {
        amount: true
      }
    });

    // Get total balance (all time)
    const totalIncomesResult = await prisma.income.aggregate({
      where: { userId: req.user.id },
      _sum: { amount: true }
    });

    const totalExpensesResult = await prisma.expense.aggregate({
      where: { userId: req.user.id },
      _sum: { amount: true }
    });

    const totalIncome = incomesResult._sum.amount || 0;
    const totalExpenses = expensesResult._sum.amount || 0;
    const balance = (totalIncomesResult._sum.amount || 0) - (totalExpensesResult._sum.amount || 0);

    // Calculate savings based on the user's goals to avoid mirroring the balance value
    const totalSavingsResult = await prisma.goal.aggregate({
      where: { userId: req.user.id },
      _sum: { currentAmount: true }
    });

    const savings = totalSavingsResult._sum.currentAmount || 0;

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      savings
    });
  } catch (error) {
    console.error('Get budget summary error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
