const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        profileImage: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const { username, email, profileImage } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        username,
        email,
        profileImage
      },
      select: {
        id: true,
        username: true,
        email: true,
        profileImage: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
