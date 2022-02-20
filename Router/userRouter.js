const express = require('express');
const userController = require('../Controller/userController');
const userRouter = express.Router();

userRouter.post('/', userController.POST);

module.exports = userRouter;
