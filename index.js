const bodyParser = require('body-parser');
const express = require('express');
const handleError = require('./Middlewares/handleError');
const {
  loginController,
} = require('./Controller');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/login', loginController)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

app.use(handleError);
