const express = require('express');
const userService = require('../Service/user.service');
const tokenAuth = require('../Service/auth.service');
const { CREATED } = require('../Dictionary/status');

const router = express.Router();

const POST = async (req, res, next) => {
  try {
    console.log('começou');
    const { email, password } = req.body;
    console.log(email);
    userService.verifyUser(email, password);
    console.log('passou 1 verifica');

    const newUser = await userService.verifyUserToCreate(email, password);
    console.log('newUser');
    console.log(newUser);
    
    const { password: _password, ...userWithoutPassword } = newUser;
    const token = tokenAuth.tokenGenerator(userWithoutPassword);
    console.log(token);

    res.status(CREATED).json({ newUser, token });
  } catch (error) {
    next(error);
  };
};

module.exports = { POST };
