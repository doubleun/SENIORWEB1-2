const assignmentRouter = require("express").Router();
const assignmentController = require("../controllers/assignmentControllers");
const multer = require("../controllers/multer");

assignmentRouter.post(
  "/uploadAssignments",
  multer.upload.array("files", 10),
  assignmentController.uploadAssignments
); // student, teacher
assignmentRouter.post(
  "/getAssignmentFiles",
  assignmentController.getAssignmentFiles
); // student, teacher
// assignmentRouter.get("/major", criteriaController.getByMajor); // Add new score criterias
// assignmentRouter.post("/edit", criteriaController.editCriteria); // admin
assignmentRouter.post("/", assignmentController.getAssignment);
assignmentRouter.post("/countFile", assignmentController.countFileByMajor);

module.exports = assignmentRouter;
