const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to check budget and create notifications
async function checkBudgetAndNotify(userId, expenseDate) {
  try {
    // Get user settings
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      select: {
        budgetAlerts: true,
        monthlyBudgetLimit: true,
        budgetAlertThreshold: true
      }
    });

    // Skip if alerts disabled or no budget limit set
    if (!settings || !settings.budgetAlerts || !settings.monthlyBudgetLimit) {
      return;
    }

    // Calculate month range for the expense date
    const date = new Date(expenseDate);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    // Get total expenses for this month
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      select: {
        amount: true
      }
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetLimit = settings.monthlyBudgetLimit;
    const percentage = (totalExpenses / budgetLimit) * 100;
    const userThreshold = settings.budgetAlertThreshold || 80;

    // Check only two thresholds: user's chosen threshold and 100%
    const thresholdsToCheck = [100, userThreshold];

    for (const threshold of thresholdsToCheck) {
      if (percentage >= threshold) {
        // Check if notification already exists for this threshold this month
        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId,
            type: 'budget_alert',
            message: {
              contains: `${threshold}%`
            },
            createdAt: {
              gte: startOfMonth
            }
          }
        });

        // Create notification if it doesn't exist
        if (!existingNotification) {
          let title, message;
          if (threshold === 100) {
            title = '🚨 Przekroczono budżet!';
            message = `Przekroczyłeś limit budżetu na ten miesiąc! Wydatki: ${totalExpenses.toFixed(2)} zł / ${budgetLimit.toFixed(2)} zł (${percentage.toFixed(0)}%)`;
          } else {
            title = `⚠️ Osiągnięto ${threshold}% budżetu`;
            message = `Wykorzystałeś ${threshold}% miesięcznego budżetu. Wydatki: ${totalExpenses.toFixed(2)} zł / ${budgetLimit.toFixed(2)} zł`;
          }

          await prisma.notification.create({
            data: {
              userId,
              type: 'budget_alert',
              title,
              message
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error checking budget:', error);
    // Don't throw error - budget check shouldn't break expense creation
  }
}

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

    // Check budget and create notification if needed (async, don't wait)
    checkBudgetAndNotify(req.user.id, date);

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
