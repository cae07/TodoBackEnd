const express = require('express');
const tasksController = require('../Controller/tasksController');
const auth = require('../Middlewares/auth');
const tasksRouter = express.Router();

tasksRouter.get('/', auth, tasksController.GET);
tasksRouter.post('/newTask', auth, tasksController.POST);
tasksRouter.put('/update', auth, tasksController.PUT);
tasksRouter.delete('/delete', auth, tasksController.DELETE);

module.exports = tasksRouter;