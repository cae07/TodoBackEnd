const Joi = require('joi');

const userSchemma = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).alphanum(),
});

const verifyUser = (email, password) => {
  const { error } = userSchemma.validate({ email, password });

  if (error) {
    throw (error);
  }
  return true;
};

module.exports = {
  verifyUser,
};
