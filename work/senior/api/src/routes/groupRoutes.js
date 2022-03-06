const groupRouter = require("express").Router();
const groupController = require("../controllers/groupControllers");
const multer = require("../controllers/multer");
const middle = require("../middleware/middle");

groupRouter.get("/getByMajor",middle.checkAuthenticatedteacher, groupController.getByMajor); // addmin, co, advisor, committee
groupRouter.post("/getGroupWithID",middle.checkAuthenticatedteacher, groupController.getGroupWithID); // coordinator
groupRouter.post("/getOnlyGroupWithID",middle.checkAuthenticatedteacher, groupController.getOnlyGroupWithID); // teacher
groupRouter.post("/getTeachersEval",middle.checkAuthenticated, groupController.getTeachersEval); // teacher, student
groupRouter.post("/getGroupInfo",middle.checkAuthenticated, groupController.getGroupInfo); // student
groupRouter.post("/getGroupMembers",middle.checkAuthenticated, groupController.getGroupMembers); // student
groupRouter.post(
  "/getTeachersWithGroupID",middle.checkAuthenticatedteacher,
  groupController.getTeachersWithGroupID
); // student
groupRouter.put("/delete",middle.checkAuthenticatedteacher, groupController.deletes); // admin, co
groupRouter.get("/all",middle.checkAuthenticated, groupController.getAll);
groupRouter.post("/createGroup",middle.checkAuthenticated, groupController.createGroup);
groupRouter.put("/statusgroup",middle.checkAuthenticated, groupController.statusgroup);
groupRouter.post("/getByRole",middle.checkAuthenticated, groupController.getByRole);
groupRouter.post("/listOwnGroup",middle.checkAuthenticated, groupController.listOwnGroup);
groupRouter.post("/getScoreCoor",middle.checkAuthenticated, groupController.getScoreCoor);
groupRouter.post("/socre",middle.checkAuthenticated, groupController.getGroupScore);
groupRouter.post("/getAllAdmin",middle.checkAuthenticated, groupController.getAllGroupsAdmin);
groupRouter.post("/listrequestGroup",middle.checkAuthenticated, groupController.listrequestGroup);
groupRouter.post("/updateMemberStatus",middle.checkAuthenticated, groupController.updateMemberStatus); // student, teacher
groupRouter.post("/getMyGroup",middle.checkAuthenticated, groupController.getMyGroup);
groupRouter.post(
  "/grading",middle.checkAuthenticated,
  multer.upload.single("file"),
  groupController.grading
);
groupRouter.put("/updateGroup",middle.checkAuthenticated, groupController.updateGroup);
groupRouter.put("/delete/one",middle.checkAuthenticated, groupController.deleteById);
groupRouter.post("/countMyGroup",middle.checkAuthenticated, groupController.countTeachergroup);
groupRouter.post("/getAllFilesMajor",middle.checkAuthenticated, groupController.getAllFilesMajor);
groupRouter.post("/moveGroup",middle.checkAuthenticated, groupController.addGroupToSeTwo);
groupRouter.post("/countprogress",middle.checkAuthenticated, groupController.countProgressGroup);


module.exports = groupRouter;
