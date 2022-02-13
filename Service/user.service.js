const Joi = require('joi');
const { findUser } = require('../Model/userModel');
const { BAD_REQUEST, NOT_FOUND } = require('../Dictionary/status');
const { ERROR_LOGIN } = require('../Dictionary/errorMessages');

const userSchemma = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).alphanum().required(),
});

const verifyUser = (email, password) => {
  const { error } = userSchemma.validate({ email, password });
  
  if (error) {
    const message = error.details[0].message;
    throw ({ status: BAD_REQUEST, message });
  }
  return true;
};

const verifyExistUser = async (email, password) => {
  console.log('começou');
  const existUser = await findUser(email, password);

  if (!existUser) {
    throw ({ status: NOT_FOUND, message: ERROR_LOGIN });
  };

  return existUser;
};

module.exports = {
  verifyUser,
  verifyExistUser,
};
