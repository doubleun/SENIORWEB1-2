const criteriaRouter = require("express").Router();
const criteriaController = require("../controllers/criteriaControllers");

criteriaRouter.get("/allMajor", criteriaController.getAllMajor); // Get all score criterias
criteriaRouter.get("/major", criteriaController.getByMajor); // Add new score criterias
criteriaRouter.post("/edit", criteriaController.editCriteria); // admin
// criteriaRouter.post("/add", criteriaController.add); // co, admin
// criteriaRouter.post("/edit", criteriaController.edit); // co, admin
// criteriaRouter.delete("/delete", criteriaController.deletes); // co, admin

module.exports = criteriaRouter;
