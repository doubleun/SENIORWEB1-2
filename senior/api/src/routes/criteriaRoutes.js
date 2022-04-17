const criteriaRouter = require("express").Router();
const criteriaController = require("../controllers/criteriaControllers");
const middle = require("../middleware/middle");

// Get criteria by major
criteriaRouter.post(
  "/scoreMajor",
  [middle.checkAuthenticated, middle.checkRole([0, 1, 2, 99])],
  criteriaController.getScoreByMajor
); // admin, coordinator, teacher

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

criteriaRouter.post(
  "/gradeMajor",
  [middle.checkAuthenticated, middle.checkRole([0, 2, 99])],
  criteriaController.getGradeByMajor
); // admin, coordinator, teacher

criteriaRouter.post(
  "/gradeEdit",
  [middle.checkAuthenticated, middle.checkRole([2]), middle.checkAccessDate],
  criteriaController.editGradeCriteria
); // coordinator

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
