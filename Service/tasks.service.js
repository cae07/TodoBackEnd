const Joi = require('joi');
const {
  getAllTasks,
  createNewTask,
  updateTask,
  deleteTask,
} = require('../Model/tasksModel');
const { BAD_REQUEST } = require('../Dictionary/status');
const { verifyId } = require('./helpers/tasks.helpers');

const taskSchemma = Joi.object({
  task: Joi.string().min(6).required(),
  status: Joi.string().required(),
});

const getTasks = async () => {
  const allTasks = await getAllTasks();

  return allTasks;
};

const verifyNewTask = async (task, userId) => {
  const { error } = taskSchemma.validate({ task, status: 'ok' });

  if(error) {
    const message = error.details[0].message
    throw ({ status: BAD_REQUEST, message });
  }

  const newTask = await createNewTask(task, userId);
  return newTask;
};

const verifyToUpdate = async (id, task, status) => {
  verifyId(id);
  const { error } = taskSchemma.validate({ task, status })

  if (error) {
    const message = error.details[0].message;
    throw ({ status: BAD_REQUEST, message });
  }

  const updatedTask = await updateTask(id, task, status);
  return updatedTask;
};

const verifyToDelete = async (id) => {
  verifyId(id);
  await deleteTask(id);

  return true;
};

module.exports = {
  getTasks,
  verifyNewTask,
  verifyToUpdate,
  verifyToDelete,
};
