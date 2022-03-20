const UserControllers = require("../controllers/userControllers");
const { checkLogin } = require("./permission");
const multer = require("../controllers/multer");
const middle = require("../middleware/middle");

var userRouter = require("express").Router();

userRouter.get("/", UserControllers.getUser);
userRouter.post("/getAllUserWithMajor", UserControllers.getAllUserWithMajor);
// Fluke made this
userRouter.post("/getAllUsersInSchool", UserControllers.getAllUsersInSchool);
userRouter.post("/getUserProjectOnTerm", UserControllers.getUserProjectOnTerm);
// userRouter.post("/gettacherwithrole", UserControllers.getTachersWithRole);
userRouter.post("/amount", UserControllers.countUser);
userRouter.post(
  "/importstudent",
  multer.uploadUser.array("files", 10),
  UserControllers.uploadfile
);
userRouter.post(
  "/importteacher",
  multer.uploadUser.array("files", 10),
  UserControllers.uploadfileteacher
);
userRouter.get("/getTeacherRole", UserControllers.getTeacherRole); // admin
userRouter.post("/updateUserRole", UserControllers.updateUserRole); // admin

module.exports = userRouter;
