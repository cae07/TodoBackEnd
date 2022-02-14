const { ObjectId } = require('mongodb');
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

const getTaskById = async (id) => {
  const db = await connection();
  const task = await db.collection('tasks').findOne(
    { _id: ObjectId(id) }
  );

  return task;
};

const updateTask = async (id, task, status) => {
  const db = await connection();
  await db.collection('tasks').updateOne(
    { _id: ObjectId(id)  },
    {
      $set: { task, status }, 
    },
  );
  const updatedTAsk = await getTaskById(id);
  return updatedTAsk;
};

const deleteTask = async (id) => {
  const db = await connection();
  await db.collection('tasks').deleteOne({ _id: ObjectId(id) });

  return true;
};

module.exports = {
  getAllTasks,
  createNewTask,
  updateTask,
  getTaskById,
  deleteTask,
};
