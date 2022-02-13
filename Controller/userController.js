const express = require('express');
const { verifyUser, verifyUserToCreate } = require('../Service/user.service');
const { CREATED } = require('../Dictionary/status');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    verifyUser(email, password);

    const newUser = await verifyUserToCreate(email, password);

    res.status(CREATED).json(newUser);
  } catch (error) {
    next(error);
  };
});

module.exports = router;
