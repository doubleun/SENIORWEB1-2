const UserControllers = require("../controllers/userControllers");
const { checkLogin } = require("./permission");
const multer = require("../controllers/multer");
const middle = require("../middleware/middle");

var userRouter = require("express").Router();

userRouter.get("/", UserControllers.getUser);
userRouter.post("/getAllUserWithMajor",middle.checkAuthenticated, UserControllers.getAllUserWithMajor);
// Fluke made this
userRouter.post("/getAllUsersInSchool",middle.checkAuthenticated, UserControllers.getAllUsersInSchool);
// userRouter.post("/gettacherwithrole", UserControllers.getTachersWithRole);
userRouter.post("/amount",middle.checkAuthenticated, UserControllers.countUser);
userRouter.post(
  "/importstudent",middle.checkAuthenticatedteacher,
  multer.uploadUser.array("files", 10),
  UserControllers.uploadfile
);
userRouter.post(
  "/importteacher",middle.checkAuthenticatedteacher,
  multer.uploadUser.array("files", 10),
  UserControllers.uploadfileteacher
);
userRouter.get("/getAllMajors", UserControllers.getAllMajors); // admin
userRouter.get("/getTeacherRole",middle.checkAuthenticated, UserControllers.getTeacherRole); // admin
userRouter.post("/updateUserRole",middle.checkAuthenticatedteacher, UserControllers.updateUserRole); // admin

module.exports = userRouter;
