const UserControllers = require("../controllers/userControllers");
const { checkLogin } = require("./permission");

var userRouter = require('express').Router();

userRouter.get("/", checkLogin, UserControllers.testuser);
userRouter.get("/getalluser", UserControllers.getAllUser);

module.exports = userRouter;