require('dotenv').config();

const mongodb = require('mongodb').MongoClient;

const MONGO_DB_URL = process.env.HOST || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'Todolist';

module.exports = () => mongodb.connect(MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((connection) => connection.db(DB_NAME))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
