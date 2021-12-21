const criteriaRouter = require("express").Router();
const criteriaController = require("../controllers/criteriaControllers");
// Get all score criterias
criteriaRouter.get("/scoreAllMajor", criteriaController.getScoreAllMajor); // admin, coordinator
// Get criteria by major
criteriaRouter.get("/scoreMajor", criteriaController.getScoreByMajor); // admin
// Edit criteria (insert, and update based on the criteria id sent from front-end)
criteriaRouter.post("/scoreEdit", criteriaController.editScoreCriteria); // coordinator

// Get all grade criterias
criteriaRouter.get("/gradeAllMajor", criteriaController.getGradeAllMajor); // admin, coordinator
// Get criteria by major
criteriaRouter.get("/gradeMajor", criteriaController.getGradeByMajor); // admin
// Edit criteria (insert, and update based on the criteria id sent from front-end)
criteriaRouter.post("/gradeEdit", criteriaController.editGradeCriteria); // coordinator

module.exports = criteriaRouter;
