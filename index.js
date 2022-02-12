const bodyParser = require('body-parser');
const express = require('express');
const handleError = require('./Middlewares/handleError');
const {
  tasksController,
} = require('./Controller');

require('dotenv').config();

const app = express();
const PORT = PROCESS.ENV.port || 3000;

app.use(bodyParser.json());

app.use('/login', tasksController)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

app.use(handleError);