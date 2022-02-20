const express = require('express');
const loginRouter = require('./loginRouter');

const router = express.Router();

router.use('/login', loginRouter);
router.use('/createUser', userController);
router.use('/tasks', tasksController);

module.exports = router;
