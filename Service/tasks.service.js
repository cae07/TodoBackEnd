const Joi = require('joi');
const tasksModel = require('../Model/tasksModel');
const { BAD_REQUEST } = require('../Dictionary/status');
const helper = require('./helpers/tasks.helpers');

const taskSchemma = Joi.object({
  task: Joi.string().min(6).required(),
  status: Joi.string().required(),
});

const getTasks = async (email) => {
  const allTasks = await tasksModel.getAllTasks(email);

  return allTasks;
};

const verifyNewTask = async (task, email) => {
  const { error } = taskSchemma.validate({ task, status: 'ok' });

  if(error) {
    const message = error.details[0].message
    throw ({ status: BAD_REQUEST, message });
  }

  const newTask = await tasksModel.createNewTask(task, email);
  return newTask;
};

const verifyToUpdate = async (id, task, status) => {
  helper.verifyId(id);
  const { error } = taskSchemma.validate({ task, status })

  if (error) {
    const message = error.details[0].message;
    throw ({ status: BAD_REQUEST, message });
  }

  const updatedTask = await tasksModel.updateTask(id, task, status);
  return updatedTask;
};

const verifyToDelete = async (id) => {
  helper.verifyId(id);
  await tasksModel.deleteTask(id);

  return true;
};

module.exports = {
  getTasks,
  verifyNewTask,
  verifyToUpdate,
  verifyToDelete,
};
