const express = require('express');
const userController = require('../Controller/loginController');
const loginRouter = express.Router();

loginRouter.post('/', userController.POST);

module.exports = loginRouter;
