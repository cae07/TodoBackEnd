const connection = require('./connection');

const findUser = async (email, password) => {
  const db = await connection();
  const user = db.collection('users').find({ email, password });

  return user;
};

const findEmail = async (email) => {
  const db = await connection();
  const user = db.collection('users').find({ email });

  return user;
};

const createNewUser = async (email, password) => {
  const db = await connection();
  const { insertedId } = await db.collection('user').insertOne(
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
