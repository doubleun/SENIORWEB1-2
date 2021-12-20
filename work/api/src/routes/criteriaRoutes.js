const criteriaRouter = require("express").Router();
const criteriaController = require("../controllers/criteriaControllers");

<<<<<<< Updated upstream
criteriaRouter.get("/allMajor", criteriaController.getAllMajor); // Get all score criterias
criteriaRouter.get("/major", criteriaController.getByMajor); // Add new score criterias
// criteriaRouter.get("/all", criteriaController.getAll); // admin
// criteriaRouter.post("/add", criteriaController.add); // co, admin
// criteriaRouter.post("/edit", criteriaController.edit); // co, admin
// criteriaRouter.delete("/delete", criteriaController.deletes); // co, admin
=======
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
>>>>>>> Stashed changes

module.exports = criteriaRouter;
