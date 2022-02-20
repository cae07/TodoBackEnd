const connection = require('./connection');

const findUser = async (email, password) => {
  const db = await connection();
  const user = await db.collection('users').findOne({ email, password });

  return user;
};

const findEmail = async (email) => {
  const db = await connection();
  const user = await db.collection('users').findOne({ email });

  return user;
};

const createNewUser = async (email, password) => {
  const db = await connection();
  const { insertedId } = await db.collection('users').insertOne(
    { email, password, role: 'user' },
  );

  const newUser = { id: insertedId, email, password, role: 'user' };

  return newUser;
};

module.exports = {
  findUser,
  findEmail,
  createNewUser,
};
