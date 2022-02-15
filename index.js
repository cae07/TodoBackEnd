const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const handleError = require('./Middlewares/handleError');
const {
  loginController,
  userController,
  tasksController,
} = require('./Controller');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.use('/login', loginController);
app.use('/createUser', userController);
app.use('/tasks', tasksController);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

app.use(handleError);

module.exports = app;
