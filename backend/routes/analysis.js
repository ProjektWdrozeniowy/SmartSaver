const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to get date range based on period
function getDateRange(period) {
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Start of next month

  let startDate;
  let months;

  switch (period) {
    case 'last3months':
      months = 3;
      break;
    case 'last6months':
      months = 6;
      break;
    case 'last12months':
      months = 12;
      break;
    case 'thisyear':
      startDate = new Date(now.getFullYear(), 0, 1);
      months = now.getMonth() + 1;
      break;
    default:
      months = 6;
  }

  if (!startDate) {
    startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  }

  return { startDate, endDate, months };
}

// Helper function to get month name in Polish (short)
function getMonthName(monthIndex) {
  const monthNames = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
  return monthNames[monthIndex];
}

// Helper function to get day name in Polish (short)
function getDayName(dayIndex) {
  const dayNames = ['Ndz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];
  return dayNames[dayIndex];
}

// GET /api/analysis/statistics - Get analysis statistics
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const period = req.query.period || 'last6months';
    const { startDate, endDate, months } = getDateRange(period);

    // Get previous period for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setMonth(prevStartDate.getMonth() - months);

    // Current period data
    const [currentIncome, currentExpenses] = await Promise.all([
      prisma.income.aggregate({
        where: {
          userId: req.user.id,
          date: { gte: startDate, lt: endDate }
        },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: {
          userId: req.user.id,
          date: { gte: startDate, lt: endDate }
        },
        _sum: { amount: true }
      })
    ]);

    // Previous period data
    const [previousIncome, previousExpenses] = await Promise.all([
      prisma.income.aggregate({
        where: {
          userId: req.user.id,
          date: { gte: prevStartDate, lt: startDate }
        },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: {
          userId: req.user.id,
          date: { gte: prevStartDate, lt: startDate }
        },
        _sum: { amount: true }
      })
    ]);

    const currentIncomeTotal = currentIncome._sum.amount || 0;
    const currentExpensesTotal = currentExpenses._sum.amount || 0;
    const previousIncomeTotal = previousIncome._sum.amount || 0;
    const previousExpensesTotal = previousExpenses._sum.amount || 0;

    const averageIncome = currentIncomeTotal / months;
    const averageExpenses = currentExpensesTotal / months;
    const averageSavings = averageIncome - averageExpenses;
    const savingsRate = averageIncome > 0 ? (averageSavings / averageIncome) * 100 : 0;

    const prevAverageIncome = previousIncomeTotal / months;
    const prevAverageExpenses = previousExpensesTotal / months;
    const prevAverageSavings = prevAverageIncome - prevAverageExpenses;
    const prevSavingsRate = prevAverageIncome > 0 ? (prevAverageSavings / prevAverageIncome) * 100 : 0;

    // Calculate changes
    const incomeChange = prevAverageIncome > 0
      ? ((averageIncome - prevAverageIncome) / prevAverageIncome) * 100
      : 0;
    const expensesChange = prevAverageExpenses > 0
      ? ((averageExpenses - prevAverageExpenses) / prevAverageExpenses) * 100
      : 0;
    const savingsChange = prevAverageSavings > 0
      ? ((averageSavings - prevAverageSavings) / prevAverageSavings) * 100
      : 0;
    const savingsRateChange = savingsRate - prevSavingsRate;

    res.json({
      averageExpenses: parseFloat(averageExpenses.toFixed(2)),
      averageIncome: parseFloat(averageIncome.toFixed(2)),
      averageSavings: parseFloat(averageSavings.toFixed(2)),
      savingsRate: parseFloat(savingsRate.toFixed(1)),
      expensesChange: parseFloat(expensesChange.toFixed(1)),
      incomeChange: parseFloat(incomeChange.toFixed(1)),
      savingsChange: parseFloat(savingsChange.toFixed(1)),
      savingsRateChange: parseFloat(savingsRateChange.toFixed(1))
    });
  } catch (error) {
    console.error('Get analysis statistics error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// GET /api/analysis/savings-growth - Get savings growth over time
router.get('/savings-growth', authenticateToken, async (req, res) => {
  try {
    const period = req.query.period || 'last6months';
    const { startDate, endDate } = getDateRange(period);

    const now = new Date(startDate);
    const data = [];
    let cumulativeSavings = 0;

    // Get data for each month
    while (now < endDate) {
      const monthStart = new Date(now);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const [monthIncome, monthExpenses] = await Promise.all([
        prisma.income.aggregate({
          where: {
            userId: req.user.id,
            date: { gte: monthStart, lt: monthEnd }
          },
          _sum: { amount: true }
        }),
        prisma.expense.aggregate({
          where: {
            userId: req.user.id,
            date: { gte: monthStart, lt: monthEnd }
          },
          _sum: { amount: true }
        })
      ]);

      const monthSavings = (monthIncome._sum.amount || 0) - (monthExpenses._sum.amount || 0);
      cumulativeSavings += monthSavings;

      data.push({
        month: getMonthName(monthStart.getMonth()),
        savings: parseFloat(cumulativeSavings.toFixed(2))
      });

      now.setMonth(now.getMonth() + 1);
    }

    res.json({ data });
  } catch (error) {
    console.error('Get savings growth error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// GET /api/analysis/income-vs-expenses - Get income vs expenses comparison
router.get('/income-vs-expenses', authenticateToken, async (req, res) => {
  try {
    const period = req.query.period || 'last6months';
    const { startDate, endDate } = getDateRange(period);

    const now = new Date(startDate);
    const data = [];

    // Get data for each month
    while (now < endDate) {
      const monthStart = new Date(now);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const [monthIncome, monthExpenses] = await Promise.all([
        prisma.income.aggregate({
          where: {
            userId: req.user.id,
            date: { gte: monthStart, lt: monthEnd }
          },
          _sum: { amount: true }
        }),
        prisma.expense.aggregate({
          where: {
            userId: req.user.id,
            date: { gte: monthStart, lt: monthEnd }
          },
          _sum: { amount: true }
        })
      ]);

      const income = monthIncome._sum.amount || 0;
      const expenses = monthExpenses._sum.amount || 0;
      const savings = income - expenses;

      data.push({
        month: getMonthName(monthStart.getMonth()),
        income: parseFloat(income.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
        savings: parseFloat(savings.toFixed(2))
      });

      now.setMonth(now.getMonth() + 1);
    }

    res.json({ data });
  } catch (error) {
    console.error('Get income vs expenses error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// GET /api/analysis/weekly-expenses - Get weekly expenses by day of week
router.get('/weekly-expenses', authenticateToken, async (req, res) => {
  try {
    const weeks = parseInt(req.query.weeks) || 8;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));

    // Get all expenses in the period
    const expenses = await prisma.expense.findMany({
      where: {
        userId: req.user.id,
        date: { gte: startDate, lte: endDate }
      },
      select: {
        amount: true,
        date: true
      }
    });

    // Group by day of week
    const dayTotals = new Array(7).fill(0);
    const dayCounts = new Array(7).fill(0);

    expenses.forEach(expense => {
      const dayOfWeek = new Date(expense.date).getDay();
      dayTotals[dayOfWeek] += expense.amount;
      dayCounts[dayOfWeek]++;
    });

    // Calculate averages and create result in Mon-Sun order
    const data = [];
    let totalAmount = 0;
    let totalDays = 0;

    // Start from Monday (1) and wrap around to Sunday (0)
    for (let i = 1; i < 7; i++) {
      const average = dayCounts[i] > 0 ? dayTotals[i] / weeks : 0;
      data.push({
        week: getDayName(i),
        amount: parseFloat(average.toFixed(2))
      });
      totalAmount += average;
      totalDays++;
    }
    // Add Sunday
    const sundayAverage = dayCounts[0] > 0 ? dayTotals[0] / weeks : 0;
    data.push({
      week: getDayName(0),
      amount: parseFloat(sundayAverage.toFixed(2))
    });
    totalAmount += sundayAverage;
    totalDays++;

    const dailyAverage = totalDays > 0 ? totalAmount / totalDays : 0;

    res.json({
      data,
      dailyAverage: parseFloat(dailyAverage.toFixed(2))
    });
  } catch (error) {
    console.error('Get weekly expenses error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
