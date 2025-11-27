const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to check if goal is achieved and create notification
async function checkGoalAchievedAndNotify(userId, goalId, previousAmount, newAmount, targetAmount, goalName) {
  try {
    // Check if goal was just achieved (wasn't achieved before, but is now)
    const wasAchieved = previousAmount >= targetAmount;
    const isAchieved = newAmount >= targetAmount;

    // Only create notification if goal was just achieved
    if (!wasAchieved && isAchieved) {
      // Check if notification already exists for this goal
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId,
          type: 'goal_achieved',
          message: {
            contains: goalName
          }
        }
      });

      if (!existingNotification) {
        // Create achievement notification
        await prisma.notification.create({
          data: {
            userId,
            type: 'goal_achieved',
            title: '🎉 Cel osiągnięty!',
            message: `Gratulacje! Osiągnąłeś cel "${goalName}". Uzbierałeś ${newAmount.toFixed(2)} zł z ${targetAmount.toFixed(2)} zł.`
          }
        });
      }
    }
  } catch (error) {
    console.error('Error checking goal achievement:', error);
    // Don't throw error - notification shouldn't break goal update
  }
}

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
  amount: z.number().positive(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.number().int().positive().optional().nullable(),
  recurringUnit: z.enum(['day', 'week', 'month', 'year']).optional().nullable(),
  recurringEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable()
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
        updatedAt: true,
        contributions: {
          where: {
            isRecurring: true,
            parentContributionId: null // Only parent recurring contributions
          },
          select: {
            id: true,
            amount: true,
            isRecurring: true,
            recurringInterval: true,
            recurringUnit: true,
            recurringEndDate: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 1 // Get only the most recent recurring contribution
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    // Transform contributions array to single object or null
    const goalsWithRecurring = goals.map(goal => ({
      ...goal,
      recurringContribution: goal.contributions.length > 0 ? goal.contributions[0] : null,
      contributions: undefined // Remove the array
    }));

    res.json({ goals: goalsWithRecurring });
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

    // Calculate difference in currentAmount to adjust contributions
    const amountDifference = currentAmount - goal.currentAmount;

    // If currentAmount changed, create an adjustment contribution
    if (amountDifference !== 0) {
      await prisma.goalContribution.create({
        data: {
          goalId: goalId,
          amount: amountDifference
        }
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

    // Check if goal was achieved and create notification
    await checkGoalAchievedAndNotify(
      req.user.id,
      goalId,
      goal.currentAmount,
      currentAmount,
      targetAmount,
      name
    );

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

// POST /api/goals/check-recurring-contributions - Check and create recurring contributions
router.post('/check-recurring-contributions', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    let createdCount = 0;

    // Get the system 'Cel' category
    const goalCategory = await prisma.category.findFirst({
      where: {
        userId: req.user.id,
        name: 'Cel',
        isSystem: true
      }
    });

    if (!goalCategory) {
      return res.status(500).json({ message: 'Błąd: Brak kategorii systemowej "Cel"' });
    }

    // Get all recurring contributions for the user (parent contributions only)
    const recurringContributions = await prisma.goalContribution.findMany({
      where: {
        goal: {
          userId: req.user.id
        },
        isRecurring: true,
        parentContributionId: null // Only parent contributions
      },
      include: {
        goal: true
      }
    });

    for (const parentContribution of recurringContributions) {
      // Check if recurring has ended
      if (parentContribution.recurringEndDate && new Date(parentContribution.recurringEndDate) < now) {
        continue; // Skip expired recurring contributions
      }

      // Get the last generated contribution for this recurring contribution
      const lastChild = await prisma.goalContribution.findFirst({
        where: {
          parentContributionId: parentContribution.id
        },
        orderBy: { createdAt: 'desc' }
      });

      // Determine the last date (either last child or parent date)
      const lastDate = lastChild ? new Date(lastChild.createdAt) : new Date(parentContribution.createdAt);

      // Calculate next date based on recurring settings
      const nextDate = new Date(lastDate);
      switch (parentContribution.recurringUnit) {
        case 'day':
          nextDate.setDate(nextDate.getDate() + parentContribution.recurringInterval);
          break;
        case 'week':
          nextDate.setDate(nextDate.getDate() + (parentContribution.recurringInterval * 7));
          break;
        case 'month':
          nextDate.setMonth(nextDate.getMonth() + parentContribution.recurringInterval);
          break;
        case 'year':
          nextDate.setFullYear(nextDate.getFullYear() + parentContribution.recurringInterval);
          break;
      }

      // Check if next date is today or in the past (and not in the future)
      if (nextDate <= now) {
        // Check if contribution hasn't ended yet
        if (!parentContribution.recurringEndDate || nextDate <= new Date(parentContribution.recurringEndDate)) {
          // Check if contribution for this date doesn't already exist
          const existingContribution = await prisma.goalContribution.findFirst({
            where: {
              parentContributionId: parentContribution.id,
              createdAt: {
                gte: new Date(nextDate.setHours(0, 0, 0, 0)),
                lt: new Date(nextDate.setHours(23, 59, 59, 999))
              }
            }
          });

          if (!existingContribution) {
            // Create new recurring contribution
            await prisma.goalContribution.create({
              data: {
                goalId: parentContribution.goalId,
                amount: parentContribution.amount,
                createdAt: nextDate,
                isRecurring: false, // Child contributions are not marked as recurring
                parentContributionId: parentContribution.id
              }
            });

            // Create expense record for this automatic contribution
            const goal = parentContribution.goal;
            await prisma.expense.create({
              data: {
                userId: req.user.id,
                categoryId: goalCategory.id,
                name: `Wpłata na cel: ${goal.name}`,
                amount: parentContribution.amount,
                date: nextDate,
                description: 'Automatyczna wpłata cykliczna na cel oszczędnościowy',
                isRecurring: false
              }
            });

            // Update goal's current amount
            const newAmount = goal.currentAmount + parentContribution.amount;
            await prisma.goal.update({
              where: { id: goal.id },
              data: {
                currentAmount: newAmount
              }
            });

            // Check if goal was achieved and create notification
            await checkGoalAchievedAndNotify(
              goal.userId,
              goal.id,
              goal.currentAmount,
              newAmount,
              goal.targetAmount,
              goal.name
            );

            createdCount++;
          }
        }
      }
    }

    res.json({
      message: 'Sprawdzono cykliczne wpłaty',
      created: createdCount
    });
  } catch (error) {
    console.error('Check recurring contributions error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// PUT /api/goals/:id/recurring-contribution - Update or delete recurring contribution
router.put('/:id/recurring-contribution', authenticateToken, async (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    const { action, amount, recurringInterval, recurringUnit, recurringEndDate } = req.body;

    // Check if goal exists and belongs to user
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: req.user.id
      },
      include: {
        contributions: {
          where: {
            isRecurring: true,
            parentContributionId: null
          }
        }
      }
    });

    if (!goal) {
      return res.status(404).json({ message: 'Cel nie został znaleziony' });
    }

    const existingRecurring = goal.contributions.find(c => c.isRecurring && !c.parentContributionId);

    if (action === 'delete') {
      // Delete existing recurring contribution
      if (existingRecurring) {
        await prisma.goalContribution.delete({
          where: { id: existingRecurring.id }
        });
        return res.json({ message: 'Cykliczna wpłata została usunięta' });
      } else {
        return res.status(404).json({ message: 'Brak cyklicznej wpłaty do usunięcia' });
      }
    } else if (action === 'update') {
      // Update existing or create new recurring contribution
      if (existingRecurring) {
        // Update existing
        const updated = await prisma.goalContribution.update({
          where: { id: existingRecurring.id },
          data: {
            amount: parseFloat(amount),
            recurringInterval: recurringInterval,
            recurringUnit: recurringUnit,
            recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null
          }
        });
        return res.json({ message: 'Cykliczna wpłata została zaktualizowana', contribution: updated });
      } else {
        // Create new
        const contribution = await prisma.goalContribution.create({
          data: {
            goalId: goalId,
            amount: parseFloat(amount),
            isRecurring: true,
            recurringInterval: recurringInterval,
            recurringUnit: recurringUnit,
            recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null
          }
        });

        // Update goal's current amount with first contribution
        await prisma.goal.update({
          where: { id: goalId },
          data: {
            currentAmount: goal.currentAmount + parseFloat(amount)
          }
        });

        return res.json({ message: 'Cykliczna wpłata została dodana', contribution });
      }
    } else {
      return res.status(400).json({ message: 'Nieprawidłowa akcja' });
    }
  } catch (error) {
    console.error('Update recurring contribution error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// POST /api/goals/:id/contribute - Add a contribution to a goal
router.post('/:id/contribute', authenticateToken, async (req, res) => {
  try {
    const goalId = parseInt(req.params.id);
    const { amount, isRecurring, recurringInterval, recurringUnit, recurringEndDate } = ContributeSchema.parse(req.body);

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

    // Get the system 'Cel' category
    const goalCategory = await prisma.category.findFirst({
      where: {
        userId: req.user.id,
        name: 'Cel',
        isSystem: true
      }
    });

    if (!goalCategory) {
      return res.status(500).json({ message: 'Błąd: Brak kategorii systemowej "Cel"' });
    }

    // Create contribution record
    const contribution = await prisma.goalContribution.create({
      data: {
        goalId: goalId,
        amount: amount,
        isRecurring: isRecurring || false,
        recurringInterval: isRecurring ? recurringInterval : null,
        recurringUnit: isRecurring ? recurringUnit : null,
        recurringEndDate: isRecurring && recurringEndDate ? new Date(recurringEndDate) : null
      }
    });

    // Create expense record for this contribution
    await prisma.expense.create({
      data: {
        userId: req.user.id,
        categoryId: goalCategory.id,
        name: `Wpłata na cel: ${goal.name}`,
        amount: amount,
        date: new Date(),
        description: `Wpłata ${isRecurring ? 'cykliczna' : 'jednorazowa'} na cel oszczędnościowy`,
        isRecurring: false
      }
    });

    // Update goal's current amount
    const newAmount = goal.currentAmount + amount;
    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentAmount: newAmount
      }
    });

    // Check if goal was achieved and create notification
    await checkGoalAchievedAndNotify(
      req.user.id,
      goalId,
      goal.currentAmount,
      newAmount,
      goal.targetAmount,
      goal.name
    );

    res.json({
      message: 'Wpłata została dodana',
      goal: updatedGoal,
      contribution
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
