const UserControllers = require("../controllers/userControllers");
const { checkLogin } = require("./permission");
const multer = require("../controllers/multer");
const middle = require("../middleware/middle");

var userRouter = require("express").Router();

// accept role = all
userRouter.get("/", UserControllers.getUser);

// accept role = admin, coordinator
userRouter.post(
  "/getAllUserWithMajor",
  [middle.checkAuthenticated, middle.checkRole([2, 99])],
  UserControllers.getAllUserWithMajor
);

// accept role = student
userRouter.post(
  "/getAllUsersInSchool",
  [middle.checkAuthenticated],
  UserControllers.getAllUsersInSchool
);

// accept role = all
userRouter.post(
  "/getUserProjectOnTerm",
  [middle.checkAuthenticated],
  UserControllers.getUserProjectOnTerm
);

// userRouter.post("/gettacherwithrole", UserControllers.getTachersWithRole);

// accept role = admin
userRouter.post(
  "/amount",
  [middle.checkAuthenticated, middle.checkRole[99]],
  UserControllers.countUser
);

// accept role = coordinator
userRouter.post(
  "/importstudent",
  [middle.checkAuthenticated, middle.checkRole[2], middle.accessDate],
  multer.uploadUser.array("files", 10),
  UserControllers.uploadfile
);

// accept role = admin
userRouter.post(
  "/importteacher",
  [middle.checkAuthenticated, middle.checkRole[99]],
  multer.uploadUser.array("files", 10),
  UserControllers.uploadfileteacher
);

// accept role = admin
userRouter.get(
  "/getTeacherRole",
  [middle.checkAuthenticated, middle.checkRole[99]],
  UserControllers.getTeacherRole
);

// accept role = admin
userRouter.post(
  "/updateUserRole",
  [middle.checkAuthenticated, middle.checkRole[99]],
  UserControllers.updateUserRole
);

module.exports = userRouter;
