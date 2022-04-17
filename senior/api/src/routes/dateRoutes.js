const dateRoutes = require("express").Router();
const dateControllers = require("../controllers/dateControllers");
const middle = require("../middleware/middle");

dateRoutes.get(
  "/getLatestProjectOnTerm",
  [middle.checkAuthenticated, middle.checkRole([99])],
  dateControllers.getLatestProjectOnTerm
); // admin

dateRoutes.post(
  "/getProjectOnTerm",
  [middle.checkAuthenticated, middle.checkRole([99])],
  dateControllers.getProjectOnTerm
); // admin

dateRoutes.get(
  "/academic/get",
  [middle.checkAuthenticated, middle.checkRole([99])],
  dateControllers.getAcademicYear
); // admin

dateRoutes.post(
  "/academic/new",
  [middle.checkAuthenticated, middle.checkRole([99])],
  dateControllers.newAcademicYear
); // admin

dateRoutes.post(
  "/semester/get",
  [middle.checkAuthenticated, middle.checkRole([99])],
  dateControllers.getSemesterDate
); // admin

dateRoutes.post(
  "/semester/new",
  [middle.checkAuthenticated, middle.checkRole([99])],
  dateControllers.newSemesterDate
); // admin

dateRoutes.post(
  "/semester/update",
  [middle.checkAuthenticated, middle.checkRole([99])],
  dateControllers.updateSemesterDate
); // admin

dateRoutes.get(
  "/allYearsSemester",
  [middle.checkAuthenticated, middle.checkRole([0, 2, 99])],
  dateControllers.getYearsSemester
); // admin, coordinator, teacher

module.exports = dateRoutes;
