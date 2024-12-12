const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Log activity
router.post('/', auth, async (req, res) => {
  try {
    const { activityType, details } = req.body;
    const activity = await prisma.userActivity.create({
      data: {
        userId: req.user.id,
        activityType,
        details
      }
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error logging activity' });
  }
});

// Get user activities
router.get('/', auth, async (req, res) => {
  try {
    const activities = await prisma.userActivity.findMany({
      where: { userId: req.user.id },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

module.exports = router;
