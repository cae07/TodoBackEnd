const express = require('express');
const loginRouter = require('./loginRouter');
const userRouter = require('./userRouter');
const tasksRouter = require('./tasksRouter');

const router = express.Router();

router.use('/login', loginRouter);
router.use('/createUser', userRouter);
router.use('/tasks', tasksRouter);

module.exports = router;
