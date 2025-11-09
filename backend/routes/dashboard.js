const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to get icon mapping
function getIconKey(title) {
  const iconMap = {
    'Aktualne saldo': 'balance',
    'Przychody (mies)': 'income',
    'Wydatki (miesiąc)': 'expenses',
    'Twój cel': 'goal'
  };
  return iconMap[title] || 'balance';
}

// Helper function to format currency
function formatCurrency(amount) {
  return `${amount.toFixed(2).replace('.', ',')} zł`;
}

// Helper function to calculate percentage change
function calculateChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous * 100).toFixed(1);
}

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get current month data
    const [currentIncome, currentExpenses, previousIncome, previousExpenses, totalBalance, activeGoal] = await Promise.all([
      // Current month income
      prisma.income.aggregate({
        where: {
          userId: req.user.id,
          date: { gte: currentMonth, lt: nextMonth }
        },
        _sum: { amount: true }
      }),
      // Current month expenses
      prisma.expense.aggregate({
        where: {
          userId: req.user.id,
          date: { gte: currentMonth, lt: nextMonth }
        },
        _sum: { amount: true }
      }),
      // Previous month income
      prisma.income.aggregate({
        where: {
          userId: req.user.id,
          date: { gte: previousMonth, lt: currentMonth }
        },
        _sum: { amount: true }
      }),
      // Previous month expenses
      prisma.expense.aggregate({
        where: {
          userId: req.user.id,
          date: { gte: previousMonth, lt: currentMonth }
        },
        _sum: { amount: true }
      }),
      // Total balance (all time income - expenses)
      prisma.$transaction([
        prisma.income.aggregate({
          where: { userId: req.user.id },
          _sum: { amount: true }
        }),
        prisma.expense.aggregate({
          where: { userId: req.user.id },
          _sum: { amount: true }
        })
      ]),
      // Get the most active goal
      prisma.goal.findFirst({
        where: { userId: req.user.id },
        orderBy: { updatedAt: 'desc' }
      })
    ]);

    const currentIncomeAmount = currentIncome._sum.amount || 0;
    const currentExpensesAmount = currentExpenses._sum.amount || 0;
    const previousIncomeAmount = previousIncome._sum.amount || 0;
    const previousExpensesAmount = previousExpenses._sum.amount || 0;
    const balance = (totalBalance[0]._sum.amount || 0) - (totalBalance[1]._sum.amount || 0);

    // Calculate changes
    const incomeChange = calculateChange(currentIncomeAmount, previousIncomeAmount);
    const expensesChange = calculateChange(currentExpensesAmount, previousExpensesAmount);

    const stats = [
      {
        title: 'Aktualne saldo',
        value: formatCurrency(balance),
        change: '+2.5%', // Mock change
        positive: true,
        iconKey: 'balance',
        color: '#00f0ff',
        navigateTo: 'budzet'
      },
      {
        title: 'Przychody (mies)',
        value: formatCurrency(currentIncomeAmount),
        change: `${incomeChange >= 0 ? '+' : ''}${incomeChange}%`,
        positive: parseFloat(incomeChange) >= 0,
        iconKey: 'income',
        color: '#a8e6cf',
        navigateTo: 'budzet'
      },
      {
        title: 'Wydatki (miesiąc)',
        value: formatCurrency(currentExpensesAmount),
        change: `${expensesChange >= 0 ? '-' : '+'}${Math.abs(expensesChange)}%`,
        positive: parseFloat(expensesChange) < 0, // Less expenses is positive
        iconKey: 'expenses',
        color: '#ff6b9d',
        navigateTo: 'wydatki'
      }
    ];

    // Add goal stat if there's an active goal
    if (activeGoal) {
      const progress = activeGoal.targetAmount > 0
        ? ((activeGoal.currentAmount / activeGoal.targetAmount) * 100).toFixed(0)
        : 0;

      stats.push({
        title: `Twój cel (${activeGoal.name})`,
        value: `${progress}%`,
        change: '+5%', // Mock change
        positive: true,
        iconKey: 'goal',
        color: '#c77dff',
        navigateTo: 'cele'
      });
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// GET /api/dashboard/transactions - Get recent transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    // Get recent expenses
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id },
      include: {
        category: {
          select: {
            name: true,
            icon: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: limit
    });

    // Get recent incomes
    const incomes = await prisma.income.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
      take: limit
    });

    // Combine and sort by date
    const transactions = [
      ...expenses.map(e => ({
        id: e.id,
        title: e.name,
        category: e.category.name,
        amount: -e.amount, // Negative for expenses
        date: e.date.toISOString().split('T')[0],
        icon: e.category.icon
      })),
      ...incomes.map(i => ({
        id: i.id,
        title: i.name,
        category: 'Przychód',
        amount: i.amount, // Positive for income
        date: i.date.toISOString().split('T')[0],
        icon: '💰'
      }))
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);

    res.json({ transactions });
  } catch (error) {
    console.error('Get dashboard transactions error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// GET /api/dashboard/expenses-by-category - Get expenses by category
router.get('/expenses-by-category', authenticateToken, async (req, res) => {
  try {
    const { month } = req.query;

    // Default to current month
    const targetMonth = month || new Date().toISOString().slice(0, 7);

    if (!/^\d{4}-\d{2}$/.test(targetMonth)) {
      return res.status(400).json({ message: 'Nieprawidłowy format miesiąca (wymagany: YYYY-MM)' });
    }

    const startDate = new Date(`${targetMonth}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Get expenses grouped by category
    const expensesByCategory = await prisma.expense.groupBy({
      by: ['categoryId'],
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

    // Get category details
    const categoryIds = expensesByCategory.map(e => e.categoryId);
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds }
      },
      select: {
        id: true,
        name: true,
        color: true
      }
    });

    // Map to response format
    const categoryMap = new Map(categories.map(c => [c.id, c]));
    const result = expensesByCategory.map(e => {
      const category = categoryMap.get(e.categoryId);
      return {
        name: category?.name || 'Unknown',
        value: e._sum.amount || 0,
        color: category?.color || '#cccccc'
      };
    });

    res.json({ categories: result });
  } catch (error) {
    console.error('Get expenses by category error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
