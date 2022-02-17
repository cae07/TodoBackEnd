const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAllTasks = async (email) => {
  const db = await connection();
  const allTasks = await db.collection('users').aggregate([
    { $match: { email } },
    {
      $lookup: {
        from: "tasks",
        localField: "email",
        foreignField: "user_email",
        as: "user_tasks",
      },
    },
  ]).toArray();

  return allTasks;
};

const createNewTask = async (task, email) => {
  const db = await connection();
  const { insertedId } = await db.collection('tasks').insertOne({ task, user_email: email, status: 'pendente' });

  const newTask = { id: insertedId, task, user_email: email, status: 'pendente' };
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
