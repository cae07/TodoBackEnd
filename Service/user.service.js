const Joi = require('joi');
const { BAD_REQUEST, NOT_FOUND } = require('../Dictionary/status');
const { ERROR_FIELD, ERROR_LOGIN } = require('../Dictionary/errorMessages');

const userSchemma = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).alphanum(),
});

const verifyUser = (email, password) => {
  const { error } = userSchemma.validate({ email, password });

  if (error) {
    throw ({ status: BAD_REQUEST, message: ERROR_FIELD });
  }
  return true;
};

const verifyExistUser = async (email, password) => {
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
