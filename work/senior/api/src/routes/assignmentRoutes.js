const assignmentRouter = require("express").Router();
const assignmentController = require("../controllers/assignmentControllers");
const multer = require("../controllers/multer");
const middle = require("../middleware/middle");

assignmentRouter.post(
  "/uploadAssignments",
  multer.upload.array("files", 10),
  assignmentController.uploadAssignments
); // student, teacher
assignmentRouter.post(
  "/getAssignmentFiles",
  assignmentController.getAssignmentFiles
); // student, teacher
assignmentRouter.post(
  "/giveProgressScore",
  multer.upload.single("file"),
  assignmentController.giveProgressScore
); // teacher
assignmentRouter.post(
  "/getTeacherProgressScore",
  assignmentController.getTeacherProgressScore
); // teacher

// FIXME: role not clear
assignmentRouter.post(
  "/getEvaluationScores",
  assignmentController.getEvaluationScores
); // teacher

// assignmentRouter.get("/major", criteriaController.getByMajor); // Add new score criterias
// assignmentRouter.post("/edit", criteriaController.editCriteria); // admin

// FIXME: this api dosen't use ?
assignmentRouter.post("/", assignmentController.getAssignment);

// FIXME: this api dosen't use ?
assignmentRouter.post("/countFile", assignmentController.countFileByMajor);

assignmentRouter.get("/abstracts", assignmentController.getAbstracts); // all

assignmentRouter.post(
  "/groupAssignment",
  assignmentController.getGroupAssignment
);// student

// assignmentRouter.post("/getBymajor", assignmentController.getAssignmentFilesMajor);

module.exports = assignmentRouter;
