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
    // Priority: check from highest to lowest
    const thresholdsToCheck = [100, userThreshold];

    let thresholdToNotify = null;

    // Find the highest exceeded threshold that doesn't have a notification yet
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

        // If no notification exists for this threshold, use it
        if (!existingNotification) {
          thresholdToNotify = threshold;
          break; // Take the highest threshold and stop
        }
      }
    }

    // Create notification only for the highest exceeded threshold
    if (thresholdToNotify !== null) {
      let title, message;
      if (thresholdToNotify === 100) {
        title = '🚨 Przekroczono budżet!';
        message = `Przekroczyłeś limit budżetu na ten miesiąc! Wydatki: ${totalExpenses.toFixed(2)} zł / ${budgetLimit.toFixed(2)} zł (${percentage.toFixed(0)}%)`;
      } else {
        title = `⚠️ Osiągnięto ${thresholdToNotify}% budżetu`;
        message = `Wykorzystałeś ${thresholdToNotify}% miesięcznego budżetu. Wydatki: ${totalExpenses.toFixed(2)} zł / ${budgetLimit.toFixed(2)} zł`;
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
  description: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.number().int().positive().optional(),
  recurringUnit: z.enum(['day', 'week', 'month', 'year']).optional(),
  recurringEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()
});

const UpdateExpenseSchema = z.object({
  name: z.string().min(1).max(100),
  categoryId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().positive(),
  description: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.number().int().positive().optional(),
  recurringUnit: z.enum(['day', 'week', 'month', 'year']).optional(),
  recurringEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()
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
        amount: true,
        isRecurring: true,
        recurringInterval: true,
        recurringUnit: true,
        recurringEndDate: true,
        parentExpenseId: true
      },
      orderBy: [
        { date: 'desc' },
        { id: 'desc' }
      ]
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
    const { name, categoryId, date, amount, description, isRecurring, recurringInterval, recurringUnit, recurringEndDate } = CreateExpenseSchema.parse(req.body);

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
        description: description || null,
        isRecurring: isRecurring || false,
        recurringInterval: isRecurring ? recurringInterval : null,
        recurringUnit: isRecurring ? recurringUnit : null,
        recurringEndDate: isRecurring && recurringEndDate ? new Date(recurringEndDate) : null
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
    const { name, categoryId, date, amount, description, isRecurring, recurringInterval, recurringUnit, recurringEndDate } = UpdateExpenseSchema.parse(req.body);

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

    // Determine if this is a recurring expense (parent or child)
    const parentId = expense.parentExpenseId || (expense.isRecurring ? expense.id : null);

    // Update current expense
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        name,
        categoryId,
        date: new Date(date),
        amount,
        description: description || null,
        isRecurring: isRecurring || false,
        recurringInterval: isRecurring ? recurringInterval : null,
        recurringUnit: isRecurring ? recurringUnit : null,
        recurringEndDate: isRecurring && recurringEndDate ? new Date(recurringEndDate) : null
      }
    });

    // If this is/was a recurring expense, update all future child expenses
    if (parentId) {
      const currentDate = new Date(date);

      // Update parent expense settings (if this is a child, update the parent)
      if (expense.parentExpenseId) {
        await prisma.expense.update({
          where: { id: expense.parentExpenseId },
          data: {
            name,
            categoryId,
            amount,
            description: description || null,
            isRecurring: isRecurring || false,
            recurringInterval: isRecurring ? recurringInterval : null,
            recurringUnit: isRecurring ? recurringUnit : null,
            recurringEndDate: isRecurring && recurringEndDate ? new Date(recurringEndDate) : null
          }
        });
      }

      // Update all future child expenses (after current date)
      await prisma.expense.updateMany({
        where: {
          parentExpenseId: parentId,
          date: { gt: currentDate }
        },
        data: {
          name,
          categoryId,
          amount,
          description: description || null
        }
      });
    }

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

// POST /api/expenses/check-recurring - Check and create recurring expenses
router.post('/check-recurring', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    let createdCount = 0;

    // Get all recurring expenses for the user (parent expenses only)
    const recurringExpenses = await prisma.expense.findMany({
      where: {
        userId: req.user.id,
        isRecurring: true,
        parentExpenseId: null // Only parent expenses
      }
    });

    for (const parentExpense of recurringExpenses) {
      // Check if recurring has ended
      if (parentExpense.recurringEndDate && new Date(parentExpense.recurringEndDate) < now) {
        continue; // Skip expired recurring expenses
      }

      // Get the last generated expense for this recurring expense
      const lastChild = await prisma.expense.findFirst({
        where: {
          parentExpenseId: parentExpense.id
        },
        orderBy: { date: 'desc' }
      });

      // Determine the last date (either last child or parent date)
      const lastDate = lastChild ? new Date(lastChild.date) : new Date(parentExpense.date);

      // Calculate next date based on recurring settings
      const nextDate = new Date(lastDate);
      switch (parentExpense.recurringUnit) {
        case 'day':
          nextDate.setDate(nextDate.getDate() + parentExpense.recurringInterval);
          break;
        case 'week':
          nextDate.setDate(nextDate.getDate() + (parentExpense.recurringInterval * 7));
          break;
        case 'month':
          nextDate.setMonth(nextDate.getMonth() + parentExpense.recurringInterval);
          break;
        case 'year':
          nextDate.setFullYear(nextDate.getFullYear() + parentExpense.recurringInterval);
          break;
      }

      // Check if next date is today or in the past (and not in the future)
      if (nextDate <= now) {
        // Check if expense hasn't ended yet
        if (!parentExpense.recurringEndDate || nextDate <= new Date(parentExpense.recurringEndDate)) {
          // Check if expense for this date doesn't already exist
          const existingExpense = await prisma.expense.findFirst({
            where: {
              parentExpenseId: parentExpense.id,
              date: {
                gte: new Date(nextDate.setHours(0, 0, 0, 0)),
                lt: new Date(nextDate.setHours(23, 59, 59, 999))
              }
            }
          });

          if (!existingExpense) {
            // Create new recurring expense
            await prisma.expense.create({
              data: {
                userId: parentExpense.userId,
                categoryId: parentExpense.categoryId,
                name: parentExpense.name,
                amount: parentExpense.amount,
                date: nextDate,
                description: parentExpense.description,
                isRecurring: false, // Child expenses are not marked as recurring
                parentExpenseId: parentExpense.id
              }
            });
            createdCount++;

            // Check budget and notify (async)
            checkBudgetAndNotify(parentExpense.userId, nextDate.toISOString().split('T')[0]);
          }
        }
      }
    }

    res.json({
      message: 'Sprawdzono cykliczne wydatki',
      created: createdCount
    });
  } catch (error) {
    console.error('Check recurring expenses error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
