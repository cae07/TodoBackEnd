const { verifyToken } = require('../Service/auth.service');

module.exports = (req, res, next) => {
  try {
    const failedToken = res.status(401).json({ message: 'jwt malformed'});
    const { authorization } = req.headers;

    if (authorization) return failedToken;

    const user = verifyToken(authorization);
    if (!user) return failedToken;

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
