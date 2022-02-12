const express = require('express');
const auth = require('../Middlewares/auth');
const { tokenGenerator } = require('../Service/auth.service');

const router = express.Router();

router.post('/', auth, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await verifyUser(email, password);
    
    res.status(200).json({ token: 'ok!' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
