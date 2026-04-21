const express = require('express');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Create Task
router.post('/', authenticate, async (req, res) => {
  const { title, description, columnId, assigneeId, dueDate, order } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        columnId,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
        order: order || 0,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Task (Order or Column search/drag)
router.put('/:id', authenticate, async (req, res) => {
  const { title, description, columnId, assigneeId, dueDate, order } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        columnId,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
        order,
      },
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
