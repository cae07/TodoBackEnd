const express = require('express');
const userService = require('../Service/user.service');
const tokenAuth = require('../Service/auth.service');
const { CREATED } = require('../Dictionary/status');

const router = express.Router();

const POST = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    userService.verifyUser(email, password);

    const newUser = await userService.verifyUserToCreate(email, password);
    
    const { password: _password, ...userWithoutPassword } = newUser;
    const token = tokenAuth.tokenGenerator(userWithoutPassword);

    res.status(CREATED).json({ newUser, token });
  } catch (error) {
    next(error);
  };
};

module.exports = { POST };
