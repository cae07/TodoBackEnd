const Joi = require('joi');
const { BAD_REQUEST } = require('../Dictionary/status');
const { ERROR_FIELD } = require('../Dictionary/errorMessages');

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

module.exports = {
  verifyUser,
};
