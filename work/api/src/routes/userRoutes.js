const UserControllers = require("../controllers/userControllers");
const { checkLogin } = require("./permission");

var userRouter = require("express").Router();

userRouter.get("/", UserControllers.getUser);
userRouter.post("/getalluserwithmajor", UserControllers.getalluserwithmajor);
userRouter.post("/amount", UserControllers.countUser);
userRouter.post("/importstudent", UserControllers.uploadfile);
userRouter.post("/importteacher", UserControllers.uploadfileteacher);
userRouter.get("/getAllMajors", UserControllers.getAllMajors); // admin

module.exports = userRouter;
