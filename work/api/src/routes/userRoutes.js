const UserControllers = require("../controllers/userControllers");
const { checkLogin } = require("./permission");

var userRouter = require("express").Router();

userRouter.get("/", UserControllers.getUser);
userRouter.get("/getalluser", UserControllers.getAllUser);
userRouter.get("/amount", UserControllers.countUser);
userRouter.post("/importstudent", UserControllers.uploadfile);
userRouter.post("/importteacher", UserControllers.uploadfileteacher);

module.exports = userRouter;
