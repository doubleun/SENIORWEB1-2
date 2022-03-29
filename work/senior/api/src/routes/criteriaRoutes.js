const criteriaRouter = require("express").Router();
const criteriaController = require("../controllers/criteriaControllers");
const middle = require("../middleware/middle");

// FIXME:
// 1.project on term id that send from front end not clear
// 2.SQL injection ?
// 3.role not clear
// TODO: implement middleware
// Get criteria by major
criteriaRouter.post(
  "/scoreMajor",
  [middle.checkAuthenticated],
  criteriaController.getScoreByMajor
); // admin, coordinator, teacher

// FIXME:
// 1.project on term id that send from front end not clear
// Edit criteria (insert, and update based on the criteria id sent from front-end)
// TODO: implement middleware
criteriaRouter.post(
  "/scoreEdit",
  [middle.checkAuthenticated, middle.checkRole([2]), middle.checkAccessDate],
  criteriaController.editScoreCriteria
); // coordinator

// Toggle score criteria status (active, inactive)
criteriaRouter.post(
  "/toggleScoreCriteriaStatus",
  [middle.checkAuthenticated, middle.checkRole([2]), middle.checkAccessDate],
  criteriaController.toggleScoreCriteriaStatus
); // coordinator

// FIXME: role not clear
// TODO: implement middleware
// Get criteria by major
criteriaRouter.post(
  "/gradeMajor",
  [middle.checkAuthenticated],
  criteriaController.getGradeByMajor
); // admin, coordinator, teacher

// FIXME: project on term id that send from front end not clear
// Edit criteria (insert, and update based on the criteria id sent from front-end)
// TODO: implement middleware
criteriaRouter.post(
  "/gradeEdit",
  [middle.checkAuthenticated, middle.checkRole([2]), middle.checkAccessDate],
  criteriaController.editGradeCriteria
); // coordinator

// FIXME: project on term id that send from front end not clear
// Add grade criteria
// TODO: implement middleware
criteriaRouter.post(
  "/gradeAdd",
  [middle.checkAuthenticated, middle.checkRole([2]), middle.checkAccessDate],
  criteriaController.addGradeCriteria
); // coordinator

// Get max score of each progress
criteriaRouter.post(
  "/getProgressMaxScore",
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  criteriaController.getProgressMaxScore
); // coordinator, teacher

// Get assignment id of each progress
criteriaRouter.post(
  "/getAssignmentId",
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  criteriaController.getAssignmentId
); // coordinator, teacher

// =========================================================

// FIXME: this api not use?
// Get all score criterias
/**
 * @deprecated - this fucntion not use
 */
criteriaRouter.get("/scoreAllMajor", criteriaController.getScoreAllMajor); // admin, coordinator

// FIXME: this api not use?
// Get all grade criterias
/**
 * @deprecated - this fucntion not use
 */
criteriaRouter.get("/gradeAllMajor", criteriaController.getGradeAllMajor); // admin, coordinator

module.exports = criteriaRouter;
