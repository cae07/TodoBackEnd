const { ObjectId } = require('mongodb');
const { BAD_REQUEST } = require('../../Dictionary/status');
const { ERROR_FIELD, FIELDS_MISS } = require('../../Dictionary/errorMessages');

const verifyId = (id) => {
  if (!id) throw ({ status: BAD_REQUEST, message: FIELDS_MISS})

  const isValid = ObjectId.isValid(id);
  if (!isValid) throw ({ status: BAD_REQUEST, message: ERROR_FIELD });

  return true;
};

module.exports = {
  verifyId,
};
