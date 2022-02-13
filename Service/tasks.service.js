const { getAllTasks } = require('../Model/tasksModel');

const getTasks = async () => {
  const allTasks = await getAllTasks();

  return allTasks;
};

module.exports = {
  getTasks,
};
