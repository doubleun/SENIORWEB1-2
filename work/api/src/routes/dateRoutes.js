const dateRoutes = require("express").Router();
const dateControllers = require("../controllers/dateControllers");

dateRoutes.post("/progression", dateControllers.getProgressionDuedate);
dateRoutes.post(
  "/progression/update",
  dateControllers.updateProgressionDuedate
);
dateRoutes.post("/semester/get", dateControllers.getSemesterDate); // Admin
dateRoutes.post("/semester/update", dateControllers.updateSemesterDate); // Admin

module.exports = dateRoutes;
