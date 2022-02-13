const express = require('express');
const auth = require('../Middlewares/auth');
const { getTasks } = require('../Service/tasks.service');
const { OK } = require('../Dictionary/status');

const router = express.Router();

router.get('/', auth, async (_req, res, next) => {
  try {
    const tasks = await getTasks();

    res.status(OK).json(tasks);
  } catch (error) {
    next(error);
  };
});

module.exports = router;
