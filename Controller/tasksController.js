const express = require('express');
const auth = require('../Middlewares/auth');
const {
  getTasks,
  verifyNewTask,
  verifyToUpdate,
  verifyToDelete,
} = require('../Service/tasks.service');
const { OK, CREATED } = require('../Dictionary/status');

const router = express.Router();

router.get('/', auth, async (_req, res, next) => {
  try {
    const tasks = await getTasks();

    res.status(OK).json(tasks);
  } catch (error) {
    next(error);
  };
});

router.post('/newTask', auth, async (req, res, next) => {
  try {
    const { task } = req.body;
    const { _id: userId } = req.user;
    const newTask = await verifyNewTask(task, userId);
    
    res.status(CREATED).json(newTask);
  } catch (error) {
    next(error);
  };
});

router.put('/update', auth, async (req, res, next) => {
  try {
    const { id, task, status } = req.body;
    const updatedTask = await verifyToUpdate(id, task, status);

    res.status(OK).json(updatedTask);
  } catch (error) {
    next(error);
  };
});

router.delete('/delete', auth, async (req, res, next) => {
  try {
    const { id } = req.body;
    await verifyToDelete(id);

    res.status(OK).json({ message: 'Task deleted successfully!'});
  } catch (error) {
    next(error);
  };
});

module.exports = router;
