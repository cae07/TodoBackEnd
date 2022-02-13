const connection = require('./connection');

const getAllTasks = async () => {
  const db = await connection();
  const allTasks = await db.collection('tasks').find({}).toArray();

  return allTasks;
};

const createNewTask = async (task) => {
  const db = await connection();
  const { insertedId } = await db.collection('tasks').insertOne({ task, status: 'pendente' });

  const newTask = { id: insertedId, task, status: 'pendente' };
  return newTask;
};

module.exports = {
  getAllTasks,
  createNewTask,
};
