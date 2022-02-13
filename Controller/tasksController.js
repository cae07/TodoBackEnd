const express = require('express');
const auth = require('../Middlewares/auth');
const { getTasks, verifyNewTask } = require('../Service/tasks.service');
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

router.post('/', auth, async (req, res, next) => {
  try {
    const { task } = req.body;
    const newTask = await verifyNewTask(task);
    
    res.status(CREATED).json(newTask);
  } catch (error) {
    next(error);
  };
});

module.exports = router;
