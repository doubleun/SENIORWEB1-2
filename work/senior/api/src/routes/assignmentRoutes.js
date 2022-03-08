const assignmentRouter = require("express").Router();
const assignmentController = require("../controllers/assignmentControllers");
const multer = require("../controllers/multer");
const middle = require("../middleware/middle");

assignmentRouter.post(
  "/uploadAssignments",middle.checkAuthenticated,
  multer.upload.array("files", 10),
  assignmentController.uploadAssignments
); // student, teacher
assignmentRouter.post(
  "/getAssignmentFiles",middle.checkAuthenticated,
  assignmentController.getAssignmentFiles
); // student, teacher
assignmentRouter.post(
  "/giveProgressScore",middle.checkAuthenticated,
  multer.upload.single("file"),
  assignmentController.giveProgressScore
); // teacher
assignmentRouter.post(
  "/getTeacherProgressScore",middle.checkAuthenticated,
  assignmentController.getTeacherProgressScore
); // teacher
assignmentRouter.post(
  "/getEvaluationScores",middle.checkAuthenticated,
  assignmentController.getEvaluationScores
); // teacher
// assignmentRouter.get("/major", criteriaController.getByMajor); // Add new score criterias
// assignmentRouter.post("/edit", criteriaController.editCriteria); // admin
assignmentRouter.post("/", assignmentController.getAssignment);

assignmentRouter.post("/countFile",middle.checkAuthenticated, assignmentController.countFileByMajor);
assignmentRouter.get("/abstracts", assignmentController.getAbstracts);
assignmentRouter.post("/groupAssignment",middle.checkAuthenticated, assignmentController.getGroupAssignment);

// assignmentRouter.post("/getBymajor", assignmentController.getAssignmentFilesMajor);

module.exports = assignmentRouter;
