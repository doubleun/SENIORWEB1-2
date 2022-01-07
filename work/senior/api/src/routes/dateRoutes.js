const dateRoutes = require("express").Router();
const dateControllers = require("../controllers/dateControllers");

dateRoutes.post("/progression", dateControllers.getProgressionDuedate);
dateRoutes.post(
  "/progression/update",
  dateControllers.updateProgressionDuedate
);
dateRoutes.get("/academic/get", dateControllers.getAcademicYear); // Admin
dateRoutes.post("/academic/new", dateControllers.newAcademicYear); // Admin
dateRoutes.post("/semester/get", dateControllers.getSemesterDate); // Admin
dateRoutes.post("/semester/new", dateControllers.newSemesterDate); // Admin
dateRoutes.post("/semester/update", dateControllers.updateSemesterDate); // Admin
dateRoutes.get("/allYearsSemester", dateControllers.getYearsSemester); // Admin

module.exports = dateRoutes;
