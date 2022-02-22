const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const { OK } = './Dictionary/status';
const handleError = require('./Middlewares/handleError');
const router = require('./Router');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.use(router);

app.get('/', (req, res) => {
  res.status(OK).send('Hello World')
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));

app.use(handleError);

module.exports = app;
