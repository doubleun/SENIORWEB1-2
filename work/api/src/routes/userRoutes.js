const UserControllers = require("../controllers/userControllers");
const { checkLogin } = require("./permission");

var userRouter = require("express").Router();

userRouter.get("/", UserControllers.getUser);
userRouter.post("/getAllUserWithMajor", UserControllers.getAllUserWithMajor);
// Fluke made this
userRouter.post("/getAllUsersInMajor", UserControllers.getAllUsersInMajor);
// userRouter.post("/gettacherwithrole", UserControllers.getTachersWithRole);
userRouter.post("/amount", UserControllers.countUser);
userRouter.post("/importstudent", UserControllers.uploadfile);
userRouter.post("/importteacher", UserControllers.uploadfileteacher);
userRouter.get("/getAllMajors", UserControllers.getAllMajors); // admin
userRouter.get("/getTeacherRole", UserControllers.getTeacherRole); // admin

module.exports = userRouter;
