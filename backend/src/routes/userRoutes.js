const UserControllers = require("../controllers/userControllers");
const { checkLogin } = require("./permission");

var userRouter = require('express').Router();

userRouter.get("/", checkLogin, UserControllers.testuser);
userRouter.get("/getalluser", UserControllers.getAllUser);
userRouter.get("/amount", UserControllers.countUser);

module.exports = userRouter;