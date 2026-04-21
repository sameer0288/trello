const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../utils/prisma');
const router = express.Router();

// Get all boards (for admin) or assigned (for user)
router.get('/', authenticate, async (req, res) => {
  try {
    let boards;
    if (req.user.role === 'ADMIN') {
      boards = await prisma.board.findMany({
        include: { columns: { include: { tasks: true } } }
      });
    } else {
      // For simplicity, let's say users can see all boards but only edit tasks
      // In a real app, we'd filter by assignment
      boards = await prisma.board.findMany({
        include: { columns: { include: { tasks: true } } }
      });
    }
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Board (Admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
  const { title } = req.body;
  try {
    const board = await prisma.board.create({
      data: {
        title,
        ownerId: req.user.id,
        columns: {
          create: [
            { title: 'Todo', order: 0 },
            { title: 'In Progress', order: 1 },
            { title: 'Done', order: 2 },
          ]
        }
      },
      include: { columns: true }
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Board (Admin only)
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    await prisma.board.delete({ where: { id: req.params.id } });
    res.json({ message: 'Board deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
