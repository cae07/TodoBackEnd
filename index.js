const bodyParser = require('body-parser');
const express = require('express');
const handleError = require('./Middlewares/handleError');

require('dotenv').config();

const app = express();
const PORT = PROCESS.ENV.port || 3000;

app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

app.use(handleError);