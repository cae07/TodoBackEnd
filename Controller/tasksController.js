const express = require('express');
// const auth = require('../Middlewares/auth');
const {
  getTasks,
  verifyNewTask,
  verifyToUpdate,
  verifyToDelete,
} = require('../Service/tasks.service');
const { OK, CREATED } = require('../Dictionary/status');

const router = express.Router();

const GET = async (req, res, next) => {
  try {
    const { email } = req.user;
    const tasks = await getTasks(email);

    res.status(OK).json(tasks);
  } catch (error) {
    next(error);
  };
};

const POST = async (req, res, next) => {
  try {
    const { task } = req.body;
    const { email } = req.user;
    const newTask = await verifyNewTask(task, email);
    
    res.status(CREATED).json(newTask);
  } catch (error) {
    next(error);
  };
};

const PUT = async (req, res, next) => {
  try {
    const { id, task, status } = req.body;

    const updatedTask = await verifyToUpdate(id, task, status);

    res.status(OK).json(updatedTask);
  } catch (error) {
    next(error);
  };
};

const DELETE = async (req, res, next) => {
  try {
    const { id } = req.body;
    await verifyToDelete(id);

    res.status(OK).json({ message: 'Task deleted successfully!'});
  } catch (error) {
    next(error);
  };
};

module.exports = {
  GET, POST, PUT, DELETE,
};
