const { verifyToken } = require('../Service/auth.service');
const { UNAUTHORIZED } = require('../Dictionary/status');
const { TOKEN_FAIL } = require('../Dictionary/errorMessages');

module.exports = (req, res, next) => {
  try {
    const failedToken = res.status(UNAUTHORIZED).json({ message: TOKEN_FAIL });

    const { authorization } = req.headers;

    if (!authorization) return failedToken;

    const user = verifyToken(authorization);
    if (!user) return failedToken;

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
