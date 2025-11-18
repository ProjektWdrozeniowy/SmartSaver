const express = require('express');
const { z } = require('zod');
const argon2 = require('argon2');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const UpdateProfileSchema = z.object({
  username: z.string().min(1).max(100),
  email: z.string().email()
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});

const UpdateNotificationsSchema = z.object({
  budgetAlerts: z.boolean(),
  goalReminders: z.boolean(),
  monthlyBudgetLimit: z.number().positive().nullable().optional(),
  budgetAlertThreshold: z.number().int().min(1).max(100).optional()
});

const DeleteAccountSchema = z.object({
  password: z.string().min(8)
});

// GET /api/user/profile - Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.account.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// PUT /api/user/profile - Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email } = UpdateProfileSchema.parse(req.body);

    // Check if email is already used by another user
    const existingUser = await prisma.account.findFirst({
      where: {
        email,
        NOT: { id: req.user.id }
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email jest już używany przez inne konto' });
    }

    const user = await prisma.account.update({
      where: { id: req.user.id },
      data: { username, email },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });

    res.json({
      message: 'Profil został zaktualizowany',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// PUT /api/user/change-password - Change user password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = ChangePasswordSchema.parse(req.body);

    // Get user with password hash
    const user = await prisma.account.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    // Verify current password
    const isPasswordValid = await argon2.verify(user.passwordHash, currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Aktualne hasło jest nieprawidłowe' });
    }

    // Hash new password
    const newPasswordHash = await argon2.hash(newPassword);

    // Update password
    await prisma.account.update({
      where: { id: req.user.id },
      data: { passwordHash: newPasswordHash }
    });

    res.json({ message: 'Hasło zostało zmienione' });
  } catch (error) {
    console.error('Change password error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// GET /api/user/notifications - Get notification settings
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { userId: req.user.id },
      select: {
        budgetAlerts: true,
        goalReminders: true,
        monthlyBudgetLimit: true,
        budgetAlertThreshold: true
      }
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: req.user.id,
          budgetAlerts: false,
          goalReminders: false,
          budgetAlertThreshold: 80
        },
        select: {
          budgetAlerts: true,
          goalReminders: true,
          monthlyBudgetLimit: true,
          budgetAlertThreshold: true
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// PUT /api/user/notifications - Update notification settings
router.put('/notifications', authenticateToken, async (req, res) => {
  try {
    const { budgetAlerts, goalReminders, monthlyBudgetLimit, budgetAlertThreshold } = UpdateNotificationsSchema.parse(req.body);

    // Prepare update data
    const updateData = {
      budgetAlerts,
      goalReminders
    };

    // Only update budget fields if provided
    if (monthlyBudgetLimit !== undefined) {
      updateData.monthlyBudgetLimit = monthlyBudgetLimit;
    }
    if (budgetAlertThreshold !== undefined) {
      updateData.budgetAlertThreshold = budgetAlertThreshold;
    }

    // Upsert (update or create) settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user.id },
      update: updateData,
      create: {
        userId: req.user.id,
        ...updateData
      },
      select: {
        budgetAlerts: true,
        goalReminders: true,
        monthlyBudgetLimit: true,
        budgetAlertThreshold: true
      }
    });

    res.json({
      message: 'Ustawienia powiadomień zaktualizowane',
      settings
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// GET /api/user/export - Export all user data
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const [user, expenses, incomes, categories, goals] = await Promise.all([
      prisma.account.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      }),
      prisma.expense.findMany({
        where: { userId: req.user.id }
      }),
      prisma.income.findMany({
        where: { userId: req.user.id }
      }),
      prisma.category.findMany({
        where: { userId: req.user.id }
      }),
      prisma.goal.findMany({
        where: { userId: req.user.id },
        include: {
          contributions: true
        }
      })
    ]);

    res.json({
      user,
      expenses,
      incomes,
      categories,
      goals
    });
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// DELETE /api/user/delete - Delete user account
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const { password } = DeleteAccountSchema.parse(req.body);

    // Get user with password hash
    const user = await prisma.account.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Nieprawidłowe hasło' });
    }

    // Delete user (cascade will delete all related data)
    await prisma.account.delete({
      where: { id: req.user.id }
    });

    res.json({ message: 'Konto zostało usunięte' });
  } catch (error) {
    console.error('Delete account error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({
        message: 'Nieprawidłowe dane: ' + error.errors.map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
