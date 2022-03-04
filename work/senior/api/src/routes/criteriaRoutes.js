const criteriaRouter = require("express").Router();
const criteriaController = require("../controllers/criteriaControllers");
const middle = require("../middleware/middle");

// Get all score criterias
criteriaRouter.get("/scoreAllMajor", criteriaController.getScoreAllMajor); // admin, coordinator
// Get criteria by major
criteriaRouter.post("/scoreMajor", criteriaController.getScoreByMajor); // admin
// Edit criteria (insert, and update based on the criteria id sent from front-end)
criteriaRouter.post("/scoreEdit", criteriaController.editScoreCriteria); // coordinator

// Get all grade criterias
criteriaRouter.get("/gradeAllMajor", criteriaController.getGradeAllMajor); // admin, coordinator
// Get criteria by major
criteriaRouter.post("/gradeMajor", criteriaController.getGradeByMajor); // admin
// Edit criteria (insert, and update based on the criteria id sent from front-end)
criteriaRouter.post("/gradeEdit", criteriaController.editGradeCriteria); // coordinator
// Add grade criteria
criteriaRouter.post("/gradeAdd", criteriaController.addGradeCriteria); // coordinator

// Get max score of each progress
criteriaRouter.post(
  "/getProgressMaxScore",
  criteriaController.getProgressMaxScore
); // teacher
// Get assignment id of each progress
criteriaRouter.post("/getAssignmentId", criteriaController.getAssignmentId); // teacher

module.exports = criteriaRouter;
