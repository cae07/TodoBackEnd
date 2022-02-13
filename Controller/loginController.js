const express = require('express');
const auth = require('../Middlewares/auth');
const { verifyUser, verifyExistUser } = require('../Service/user.service');
const { tokenGenerator } = require('../Service/auth.service');
const { OK } = require('../Dictionary/status');


const router = express.Router();

router.post('/', auth, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    verifyUser(email, password);
    const user = await verifyExistUser(email, password);
    
    res.status(OK).json({ token: 'ok!' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
