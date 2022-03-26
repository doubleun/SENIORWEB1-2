const MajorControllers = require("../controllers/majorController");
const majorRouter = require("express").Router();
const middle = require("../middleware/middle");

majorRouter.get(
  "/getAllActiveMajors",
  [middle.checkAuthenticated],
  MajorControllers.getAllActiveMajors
); // admin, cooridator TODO: not sure only admin or coor use this api

majorRouter.get(
  "/getAllMajors",
  [middle.checkAuthenticated, middle.checkRole([99])],
  MajorControllers.getAllMajors
); // admin

majorRouter.post(
  "/add",
  [middle.checkAuthenticated, middle.checkRole([99])],
  MajorControllers.addMajor
); // admin,

majorRouter.put(
  "/update",
  [middle.checkAuthenticated, middle.checkRole([99])],
  MajorControllers.updateMajor
); // admin,

module.exports = majorRouter;
