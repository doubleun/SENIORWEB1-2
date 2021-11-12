const UserControllers = require("../controllers/userControllers")

var userRouter = require('express').Router();

userRouter.get("/", UserControllers.testuser);
userRouter.get("/getalluser", UserControllers.getAllUser);

module.exports = userRouter;