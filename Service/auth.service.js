const jwt = require('jsonwebtoken');

require('dotenv').config();

const { API_SECRET } = process.env;

const JWT_CONFIG = {
  expiresIn: '1d',
  algorithm: 'HS256',
};

const tokenGenerator = (data) => {
  jwt.sign({ data }, API_SECRET, JWT_CONFIG);
};

const verifyToken = (token) => {
  try {
    const { data } = jwt.verify(token, API_SECRET);

    const user = data;

    return user;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

module.exports = {
  tokenGenerator,
  verifyToken,
};
