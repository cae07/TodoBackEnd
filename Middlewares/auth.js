const { verifyToken } = require('../Service/auth.service');
const { UNAUTHORIZED } = require('../Dictionary/status');
const { TOKEN_FAIL } = require('../Dictionary/errorMessages');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    
    if (!authorization) return res.status(UNAUTHORIZED).json({ message: TOKEN_FAIL });;

    const user = verifyToken(authorization);
    if (!user) return res.status(UNAUTHORIZED).json({ message: TOKEN_FAIL });;

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
