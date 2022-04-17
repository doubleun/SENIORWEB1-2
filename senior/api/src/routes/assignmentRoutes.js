const assignmentRouter = require("express").Router();
const assignmentController = require("../controllers/assignmentControllers");
const multer = require("../controllers/multer");
const middle = require("../middleware/middle");

assignmentRouter.post(
  "/uploadAssignments",
  [
    middle.checkAuthenticated,
    middle.checkRole([0, 1, 2]),
    middle.checkAccessDate,
  ],
  multer.upload.array("files", 10),
  assignmentController.uploadAssignments
); // student, teacher

assignmentRouter.post(
  "/getAssignmentFiles",
  [middle.checkAuthenticated, middle.checkRole([0, 1, 2])],
  assignmentController.getAssignmentFiles
); // student, teacher

assignmentRouter.post(
  "/giveProgressScore",
  multer.upload.single("file"),
  [middle.checkAuthenticated, middle.checkRole([0, 2]), middle.checkAccessDate],
  assignmentController.giveProgressScore
); // teacher

assignmentRouter.post(
  "/getTeacherProgressScore",
  [middle.checkAuthenticated, middle.checkRole([0, 2])],
  assignmentController.getTeacherProgressScore
); // teacher

assignmentRouter.get("/abstracts", assignmentController.getAbstracts); // all

assignmentRouter.post(
  "/groupAssignment",
  [middle.checkAuthenticated, middle.checkRole([1])],
  assignmentController.getGroupAssignment
); // student

assignmentRouter.post(
  "/getEvaluationScores",
  [middle.checkAuthenticated],
  assignmentController.getEvaluationScores
); // coordinator, teacher, student

/**
 * @deprecated -this function not use
 */
// FIXME: this api dosen't use ?
assignmentRouter.post("/", assignmentController.getAssignment);

/**
 * @deprecated -this function not use
 */
// FIXME: this api dosen't use ?
// assignmentRouter.post("/countFile", assignmentController.countFileByMajor);

// assignmentRouter.post("/getBymajor", assignmentController.getAssignmentFilesMajor);

module.exports = assignmentRouter;
