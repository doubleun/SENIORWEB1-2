const dateRoutes = require("express").Router();
const dateControllers = require("../controllers/dateControllers");
const middle = require("../middleware/middle");

dateRoutes.get(
  "/getLatestProjectOnTerm",middle.checkAuthenticated,
  dateControllers.getLatestProjectOnTerm
);
dateRoutes.post("/progression",middle.checkAuthenticated, dateControllers.getProgressionDuedate);
dateRoutes.post(
  "/progression/update",middle.checkAuthenticatedteacher,
  dateControllers.updateProgressionDuedate
);
dateRoutes.get("/academic/get",middle.checkAuthenticatedteacher, dateControllers.getAcademicYear); // Admin
dateRoutes.post("/academic/new",middle.checkAuthenticatedteacher, dateControllers.newAcademicYear); // Admin
dateRoutes.post("/semester/get",middle.checkAuthenticatedteacher, dateControllers.getSemesterDate); // Admin
dateRoutes.post("/semester/new",middle.checkAuthenticatedteacher, dateControllers.newSemesterDate); // Admin
dateRoutes.post("/semester/update",middle.checkAuthenticatedteacher, dateControllers.updateSemesterDate); // Admin
dateRoutes.get("/allYearsSemester",middle.checkAuthenticatedteacher, dateControllers.getYearsSemester); // Admin
dateRoutes.post("/getProgressDueDate",middle.checkAuthenticatedteacher, dateControllers.getProgressDueDate); // Student, Teacher

module.exports = dateRoutes;
