const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const CreateGoalSchema = z.object({
  name: z.string().min(1).max(100),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).default(0),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().max(500).optional()
});

const UpdateGoalSchema = z.object({
  name: z.string().min(1).max(100),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().max(500).optional()
});

const ContributeSchema = z.object({
  amount: z.number().positive()
});

// GET /api/goals - Get all goals for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        name: true,
        targetAmount: true,
        currentAmount: true,
        dueDate: true,
        description: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// POST /api/goals - Create a new goal
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, dueDate, description } = CreateGoalSchema.parse(req.body);

    // Validate that dueDate is in the future
    const dueDateObj = new Date(dueDate);
    if (dueDateObj <= new Date()) {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: dueDate musi być w przyszłości'
      });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: req.user.id,
        name,
        targetAmount,
        currentAmount: currentAmount || 0,
        dueDate: dueDateObj,
        description: description || null
      }
    });

    res.status(201).json({
      message: 'Cel został dodany',
      goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// PUT /api/goals/:id - Update a goal
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    const { name, targetAmount, currentAmount, dueDate, description } = UpdateGoalSchema.parse(req.body);

    // Check if goal exists and belongs to user
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Cel nie został znaleziony' });
    }

    // Validate that currentAmount is not greater than targetAmount
    if (currentAmount > targetAmount) {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: currentAmount nie może być większe niż targetAmount'
      });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        name,
        targetAmount,
        currentAmount,
        dueDate: new Date(dueDate),
        description: description || null
      }
    });

    res.json({
      message: 'Cel został zaktualizowany',
      goal: updatedGoal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// DELETE /api/goals/:id - Delete a goal
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const goalId = parseInt(req.params.id);

    // Check if goal exists and belongs to user
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Cel nie został znaleziony' });
    }

    await prisma.goal.delete({
      where: { id: goalId }
    });

    res.json({ message: 'Cel został usunięty' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// POST /api/goals/:id/contribute - Add a contribution to a goal
router.post('/:id/contribute', authenticateToken, async (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    const { amount } = ContributeSchema.parse(req.body);

    // Check if goal exists and belongs to user
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Cel nie został znaleziony' });
    }

    // Create contribution record
    await prisma.goalContribution.create({
      data: {
        goalId: goalId,
        amount: amount
      }
    });

    // Update goal's current amount
    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentAmount: goal.currentAmount + amount
      }
    });

    res.json({
      message: 'Wpłata została dodana',
      goal: updatedGoal
    });
  } catch (error) {
    console.error('Contribute to goal error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
