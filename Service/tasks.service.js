const Joi = require('joi');
const { getAllTasks, createNewTask } = require('../Model/tasksModel');
const { BAD_REQUEST } = require('../Dictionary/status');
const { FIELDS_MISS } = require('../Dictionary/errorMessages');

const taskSchemma = Joi.object({
  task: Joi.string().min(6).required(),
});

const getTasks = async () => {
  const allTasks = await getAllTasks();

  return allTasks;
};

const verifyNewTask = async (task) => {
  const { error } = taskSchemma.validate({ task });

  if(error) {
    const message = error.details[0].message
    throw ({ status: BAD_REQUEST, message });
  }

  const newTask = await createNewTask(task);
  return newTask;
};

module.exports = {
  getTasks,
  verifyNewTask,
};
