const Joi = require('joi');
const {
  getAllTasks,
  createNewTask,
  updateTask,
} = require('../Model/tasksModel');
const { BAD_REQUEST } = require('../Dictionary/status');

const taskSchemma = Joi.object({
  task: Joi.string().min(6).required(),
  status: Joi.string().required(),
});

const getTasks = async () => {
  const allTasks = await getAllTasks();

  return allTasks;
};

const verifyNewTask = async (task) => {
  const { error } = taskSchemma.validate({ task, status: 'ok' });

  if(error) {
    const message = error.details[0].message
    throw ({ status: BAD_REQUEST, message });
  }

  const newTask = await createNewTask(task);
  return newTask;
};

const verifyToUpdate = async (id, task, status) => {
  const { error } = taskSchemma.validate({ task, status })

  if (error) {
    const message = error.details[0].message;
    throw ({ status: BAD_REQUEST, message });
  }

  const updatedTask = await updateTask(task, status);
  return updatedTask;
};

module.exports = {
  getTasks,
  verifyNewTask,
  verifyToUpdate,
};
