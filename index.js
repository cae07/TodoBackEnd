const express = require('express');

require('dotenv').config();

const app = express();
const PORT = PROCESS.ENV.port || 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
