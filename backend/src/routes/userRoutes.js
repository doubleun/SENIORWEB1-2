const UserControllers = require("../controllers/userControllers")
const path = require('path');

var userRouter = require('express').Router();

userRouter.get("/", UserControllers.testuser);
userRouter.get("/getalluser", UserControllers.getAllUser);
userRouter.post("/importuser", UserControllers.uploadfile);
userRouter.post('/upload-avatar', UserControllers.uploadfile);

module.exports = userRouter;