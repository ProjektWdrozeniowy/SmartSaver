const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/notifications - Get all notifications for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { filter } = req.query; // 'all', 'unread', or specific type

    const where = { userId: req.user.id };

    if (filter === 'unread') {
      where.isRead = false;
    } else if (filter && filter !== 'all') {
      where.type = filter;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to last 100 notifications
    });

    // Get count of unread notifications
    const unreadCount = await prisma.notification.count({
      where: {
        userId: req.user.id,
        isRead: false
      }
    });

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);

    // Verify notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Powiadomienie nie znalezione' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    res.json({
      message: 'Powiadomienie oznaczone jako przeczytane',
      notification: updatedNotification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({ message: 'Wszystkie powiadomienia oznaczone jako przeczytane' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);

    // Verify notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Powiadomienie nie znalezione' });
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    res.json({ message: 'Powiadomienie zostało usunięte' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// DELETE /api/notifications - Delete all notifications
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await prisma.notification.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({ message: 'Wszystkie powiadomienia zostały usunięte' });
  } catch (error) {
    console.error('Delete all notifications error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// POST /api/notifications/check-goal-reminders - Check and create goal reminders
router.post('/check-goal-reminders', authenticateToken, async (req, res) => {
  try {
    // Get user settings
    const settings = await prisma.userSettings.findUnique({
      where: { userId: req.user.id },
      select: {
        goalReminders: true,
        goalReminderDeadlineDays: true,
        goalReminderInactivityDays: true
      }
    });

    // If goal reminders are disabled, return early
    if (!settings || !settings.goalReminders) {
      return res.json({ message: 'Przypomnienia o celach wyłączone', created: 0 });
    }

    const deadlineDays = settings.goalReminderDeadlineDays || 7;
    const inactivityDays = settings.goalReminderInactivityDays || 14;
    const now = new Date();
    let createdCount = 0;

    // Get all active goals for the user
    const goals = await prisma.goal.findMany({
      where: {
        userId: req.user.id,
        dueDate: { gte: now } // Only active goals (not expired)
      },
      include: {
        contributions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    for (const goal of goals) {
      // Check 1: Deadline reminder - send ONLY ONCE when exactly deadlineDays remain
      // Compare dates only (ignore time) for accurate day calculation
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      const deadlineDate = new Date(goal.dueDate);
      deadlineDate.setHours(0, 0, 0, 0);
      const daysUntilDeadline = Math.round((deadlineDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilDeadline === deadlineDays && !goal.deadlineReminderSent) {
        // Create notification and mark as sent
        await prisma.notification.create({
          data: {
            userId: req.user.id,
            type: 'goal_reminder',
            title: '⏰ Zbliża się termin celu',
            message: `Zbliża się termin celu "${goal.name}". Pozostało ${daysUntilDeadline} ${daysUntilDeadline === 1 ? 'dzień' : 'dni'}!`
          }
        });

        // Mark reminder as sent so it won't be created again
        await prisma.goal.update({
          where: { id: goal.id },
          data: { deadlineReminderSent: true }
        });

        createdCount++;
      }

      // Check 2: Inactivity reminder
      if (goal.contributions.length > 0) {
        const lastContribution = goal.contributions[0];
        const contributionDate = new Date(lastContribution.createdAt);
        contributionDate.setHours(0, 0, 0, 0);
        const daysSinceContribution = Math.round((today - contributionDate) / (1000 * 60 * 60 * 24));

        if (daysSinceContribution >= inactivityDays) {
          // Check if inactivity notification already exists recently
          const existingInactivityNotif = await prisma.notification.findFirst({
            where: {
              userId: req.user.id,
              type: 'goal_reminder',
              message: {
                contains: `Nie wpłacałeś na cel "${goal.name}"`
              },
              createdAt: {
                gte: new Date(now.getTime() - inactivityDays * 24 * 60 * 60 * 1000)
              }
            }
          });

          if (!existingInactivityNotif) {
            await prisma.notification.create({
              data: {
                userId: req.user.id,
                type: 'goal_reminder',
                title: '💤 Brak aktywności w celu',
                message: `Nie wpłacałeś na cel "${goal.name}" od ${daysSinceContribution} dni. Rozważ dokonanie wpłaty!`
              }
            });
            createdCount++;
          }
        }
      } else if (goal.currentAmount === 0) {
        // Goal has no contributions at all
        const creationDate = new Date(goal.createdAt);
        creationDate.setHours(0, 0, 0, 0);
        const daysSinceCreation = Math.round((today - creationDate) / (1000 * 60 * 60 * 24));

        if (daysSinceCreation >= inactivityDays) {
          const existingNoContributionNotif = await prisma.notification.findFirst({
            where: {
              userId: req.user.id,
              type: 'goal_reminder',
              message: {
                contains: `Nie wpłacałeś jeszcze na cel "${goal.name}"`
              },
              createdAt: {
                gte: new Date(now.getTime() - inactivityDays * 24 * 60 * 60 * 1000)
              }
            }
          });

          if (!existingNoContributionNotif) {
            await prisma.notification.create({
              data: {
                userId: req.user.id,
                type: 'goal_reminder',
                title: '📝 Rozpocznij oszczędzanie',
                message: `Nie wpłacałeś jeszcze na cel "${goal.name}". Rozpocznij oszczędzanie już dziś!`
              }
            });
            createdCount++;
          }
        }
      }
    }

    res.json({
      message: 'Sprawdzono przypomnienia o celach',
      created: createdCount
    });
  } catch (error) {
    console.error('Check goal reminders error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
