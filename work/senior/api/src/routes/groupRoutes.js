const groupRouter = require("express").Router();
const groupController = require("../controllers/groupControllers");

groupRouter.get("/getByMajor", groupController.getByMajor); // addmin, co, advisor, committee
groupRouter.post("/getGroupWithID", groupController.getGroupWithID); // coordinator
groupRouter.post("/getGroupInfo", groupController.getGroupInfo); // student
groupRouter.post("/getGroupMembers", groupController.getGroupMembers); // student
groupRouter.post(
  "/getTeachersWithGroupID",
  groupController.getTeachersWithGroupID
); // student
groupRouter.put("/delete", groupController.deletes); // admin, co
groupRouter.get("/all", groupController.getAll);
groupRouter.post("/createGroup", groupController.createGroup);
groupRouter.put("/statusgroup", groupController.statusgroup);
groupRouter.post("/getByRole", groupController.getByRole);
groupRouter.post("/listOwnGroup", groupController.listOwnGroup);
groupRouter.post("/getScoreCoor", groupController.getScoreCoor);
groupRouter.post("/socre", groupController.getGroupScore);
groupRouter.post("/getAllAdmin", groupController.getAllGroupsAdmin);
groupRouter.post("/listrequestGroup", groupController.listrequestGroup);
groupRouter.post("/updateMemberStatus", groupController.updateMemberStatus); // student, teacher
groupRouter.post("/getMyGroup", groupController.getMyGroup);
groupRouter.post("/grading", groupController.grading);
groupRouter.post("/updateGroup", groupController.updateGroup);

groupRouter.put("/delete/one", groupController.deleteById);

module.exports = groupRouter;