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
  description: z.string().nullable().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.number().int().positive().optional(),
  recurringUnit: z.enum(['day', 'week', 'month', 'year']).optional(),
  recurringEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()
});

const UpdateIncomeSchema = z.object({
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().nullable().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.number().int().positive().optional(),
  recurringUnit: z.enum(['day', 'week', 'month', 'year']).optional(),
  recurringEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()
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
        description: true,
        isRecurring: true,
        recurringInterval: true,
        recurringUnit: true,
        recurringEndDate: true,
        parentIncomeId: true,
        parentIncome: {
          select: {
            recurringInterval: true,
            recurringUnit: true,
            recurringEndDate: true
          }
        }
      },
      orderBy: [
        { date: 'desc' },
        { id: 'desc' }
      ]
    });

    // For child incomes, use parent's recurring settings
    const enrichedIncomes = incomes.map(income => {
      if (income.parentIncomeId && income.parentIncome) {
        return {
          ...income,
          recurringInterval: income.parentIncome.recurringInterval,
          recurringUnit: income.parentIncome.recurringUnit,
          recurringEndDate: income.parentIncome.recurringEndDate,
          parentIncome: undefined // Remove from response
        };
      }
      return {
        ...income,
        parentIncome: undefined // Remove from response
      };
    });

    res.json({ incomes: enrichedIncomes });
  } catch (error) {
    console.error('Get incomes error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// POST /api/budget/income - Create a new income
router.post('/income', authenticateToken, async (req, res) => {
  try {
    const { name, amount, date, description, isRecurring, recurringInterval, recurringUnit, recurringEndDate } = CreateIncomeSchema.parse(req.body);

    const income = await prisma.income.create({
      data: {
        userId: req.user.id,
        name,
        amount,
        date: new Date(date),
        description: description || null,
        isRecurring: isRecurring || false,
        recurringInterval: isRecurring ? recurringInterval : null,
        recurringUnit: isRecurring ? recurringUnit : null,
        recurringEndDate: isRecurring && recurringEndDate ? new Date(recurringEndDate) : null
      }
    });

    res.status(201).json({
      message: 'Przychód został dodany',
      income
    });
  } catch (error) {
    console.error('Create income error:', error);
    if (error instanceof z.ZodError) {
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
    const { name, amount, date, description, isRecurring, recurringInterval, recurringUnit, recurringEndDate } = UpdateIncomeSchema.parse(req.body);

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

    // Determine if this is a recurring income (parent or child)
    const parentId = income.parentIncomeId || (income.isRecurring ? income.id : null);

    // Update current income
    const updatedIncome = await prisma.income.update({
      where: { id: incomeId },
      data: {
        name,
        amount,
        date: new Date(date),
        description: description || null,
        isRecurring: isRecurring || false,
        recurringInterval: isRecurring ? recurringInterval : null,
        recurringUnit: isRecurring ? recurringUnit : null,
        recurringEndDate: isRecurring && recurringEndDate ? new Date(recurringEndDate) : null
      }
    });

    // If this is/was a recurring income, update all future child incomes
    if (parentId) {
      const currentDate = new Date(date);

      // Update parent income settings (if this is a child, update the parent)
      if (income.parentIncomeId) {
        await prisma.income.update({
          where: { id: income.parentIncomeId },
          data: {
            name,
            amount,
            description: description || null,
            isRecurring: isRecurring || false,
            recurringInterval: isRecurring ? recurringInterval : null,
            recurringUnit: isRecurring ? recurringUnit : null,
            recurringEndDate: isRecurring && recurringEndDate ? new Date(recurringEndDate) : null
          }
        });
      }

      // Update all future child incomes (after current date)
      await prisma.income.updateMany({
        where: {
          parentIncomeId: parentId,
          date: { gt: currentDate }
        },
        data: {
          name,
          amount,
          description: description || null
        }
      });
    }

    res.json({
      message: 'Przychód został zaktualizowany',
      income: updatedIncome
    });
  } catch (error) {
    console.error('Update income error:', error);
    if (error instanceof z.ZodError) {
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

    // Get total goal contributions (all time)
    const totalGoalContributionsResult = await prisma.goalContribution.aggregate({
      where: {
        goal: { userId: req.user.id }
      },
      _sum: { amount: true }
    });

    const totalIncome = incomesResult._sum.amount || 0;
    const totalExpenses = expensesResult._sum.amount || 0;
    const totalGoalContributions = totalGoalContributionsResult._sum.amount || 0;
    const balance = (totalIncomesResult._sum.amount || 0) - (totalExpensesResult._sum.amount || 0) - totalGoalContributions;

    res.json({
      totalIncome,
      totalExpenses,
      balance
    });
  } catch (error) {
    console.error('Get budget summary error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// POST /api/budget/income/check-recurring - Check and create recurring incomes
router.post('/income/check-recurring', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    let createdCount = 0;

    // Get all recurring incomes for the user (parent incomes only)
    const recurringIncomes = await prisma.income.findMany({
      where: {
        userId: req.user.id,
        isRecurring: true,
        parentIncomeId: null // Only parent incomes
      }
    });

    for (const parentIncome of recurringIncomes) {
      // Check if recurring has ended
      if (parentIncome.recurringEndDate && new Date(parentIncome.recurringEndDate) < now) {
        continue; // Skip expired recurring incomes
      }

      // Get the last generated income for this recurring income
      const lastChild = await prisma.income.findFirst({
        where: {
          parentIncomeId: parentIncome.id
        },
        orderBy: { date: 'desc' }
      });

      // Determine the last date (either last child or parent date)
      const lastDate = lastChild ? new Date(lastChild.date) : new Date(parentIncome.date);

      // Calculate next date based on recurring settings
      const nextDate = new Date(lastDate);
      switch (parentIncome.recurringUnit) {
        case 'day':
          nextDate.setDate(nextDate.getDate() + parentIncome.recurringInterval);
          break;
        case 'week':
          nextDate.setDate(nextDate.getDate() + (parentIncome.recurringInterval * 7));
          break;
        case 'month':
          nextDate.setMonth(nextDate.getMonth() + parentIncome.recurringInterval);
          break;
        case 'year':
          nextDate.setFullYear(nextDate.getFullYear() + parentIncome.recurringInterval);
          break;
      }

      // Check if next date is today or in the past (and not in the future)
      if (nextDate <= now) {
        // Check if income hasn't ended yet
        if (!parentIncome.recurringEndDate || nextDate <= new Date(parentIncome.recurringEndDate)) {
          // Check if income for this date doesn't already exist
          const existingIncome = await prisma.income.findFirst({
            where: {
              parentIncomeId: parentIncome.id,
              date: {
                gte: new Date(nextDate.setHours(0, 0, 0, 0)),
                lt: new Date(nextDate.setHours(23, 59, 59, 999))
              }
            }
          });

          if (!existingIncome) {
            // Create new recurring income
            await prisma.income.create({
              data: {
                userId: parentIncome.userId,
                name: parentIncome.name,
                amount: parentIncome.amount,
                date: nextDate,
                description: parentIncome.description,
                isRecurring: false, // Child incomes are not marked as recurring
                parentIncomeId: parentIncome.id
              }
            });
            createdCount++;
          }
        }
      }
    }

    res.json({
      message: 'Sprawdzono cykliczne przychody',
      created: createdCount
    });
  } catch (error) {
    console.error('Check recurring incomes error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
