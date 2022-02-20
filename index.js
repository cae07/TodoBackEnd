const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const { OK } = './Dictionary/status';
const handleError = require('./Middlewares/handleError');
// const {
//   loginController,
//   userController,
//   tasksController,
// } = require('./Controller');
const router = require('./Router');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.use(router)
// app.use('/login', loginController);
// app.use('/createUser', userController);
// app.use('/tasks', tasksController);

app.get('/', (req, res) => {
  res.status(OK).send('Hello World')
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

app.use(handleError);

module.exports = app;
