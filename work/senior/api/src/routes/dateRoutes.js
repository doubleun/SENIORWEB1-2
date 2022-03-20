const dateRoutes = require("express").Router();
const dateControllers = require("../controllers/dateControllers");
const middle = require("../middleware/middle");

dateRoutes.get(
  "/getLatestProjectOnTerm",
  dateControllers.getLatestProjectOnTerm
);
dateRoutes.post("/getProjectOnTerm", dateControllers.getProjectOnTerm);
dateRoutes.get("/academic/get", dateControllers.getAcademicYear); // Admin
dateRoutes.post("/academic/new", dateControllers.newAcademicYear); // Admin
dateRoutes.post("/semester/get", dateControllers.getSemesterDate); // Admin
dateRoutes.post("/semester/new", dateControllers.newSemesterDate); // Admin
dateRoutes.post("/semester/update", dateControllers.updateSemesterDate); // Admin
dateRoutes.get("/allYearsSemester", dateControllers.getYearsSemester); // Admin

module.exports = dateRoutes;
