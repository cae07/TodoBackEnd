const express = require('express');
const tasksController = require('../Controller/tasksController');
const taskRouter = express.Router();

taskRouter.post('/', tasksController.login);

module.exports = taskRouter;
