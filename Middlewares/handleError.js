const { INTERNAL_SERVER_ERROR } = require('../Dictionary/status');
const { INTERNAL_ERROR } = require('../Dictionary/errorMessages');

module.exports = (error, _req, res, _next) => {
  if (error.status) {
    console.error(error.message);
    return res.status(error.status).json({ message: error.message });
  }
  console.error(error.message);
  return res.status(INTERNAL_SERVER_ERROR).json({ message: INTERNAL_ERROR });
};
