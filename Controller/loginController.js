const userService = require('../Service/user.service');
const tokenAuth = require('../Service/auth.service');
const { OK } = require('../Dictionary/status');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    userService.verifyUser(email, password);
    const user = await userService.verifyExistUser(email, password);
    const { password: _password, ...userWithoutPassword } = user;

    const userToken = tokenAuth.tokenGenerator(userWithoutPassword);

    res.status(OK).json({ token: userToken });
  } catch (error) {
    next(error);
  };
};

module.exports = { login };
