const connection = require('./connection');

const findUser = async (email, password) => {
  const db = await connection();
  console.log('noiz');
  const user = await db.collection('users').findOne({ email, password });

  return user;
};

module.exports = {
  findUser,
};
