const userService = require('../Service/user.service');
const tokenAuth = require('../Service/auth.service');
const { OK } = require('../Dictionary/status');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    userService.verifyUser(email, password);
    const user = await userService.verifyExistUser(email, password);
    const { password: _password, ...userWithoutPassword } = user;

    const token = tokenAuth.tokenGenerator(userWithoutPassword);

    res.status(OK).json(token);
  } catch (error) {
    next(error);
  };
};

module.exports = { login };
