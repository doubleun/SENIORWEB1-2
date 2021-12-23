const assignmentRouter = require("express").Router();
const assignmentController = require("../controllers/assignmentControllers");

assignmentRouter.post(
  "/uploadAssignments",
  assignmentController.uploadAssignments
); // student, teacher
// assignmentRouter.get("/major", criteriaController.getByMajor); // Add new score criterias
// assignmentRouter.post("/edit", criteriaController.editCriteria); // admin
assignmentRouter.post('/',assignmentController.getAssignment)

module.exports = assignmentRouter;
