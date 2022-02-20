const express = require('express');
const loginRouter = require('./loginRouter');

const router = express.Router();

router.use('/login', loginRouter);
// app.use('/createUser', userController);
// app.use('/tasks', tasksController);

module.exports = router;
