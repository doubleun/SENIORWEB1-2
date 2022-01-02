const groupRouter = require("express").Router();
const groupController = require("../controllers/groupControllers");

groupRouter.get("/getByMajor", groupController.getByMajor); // addmin, co, advisor, committee
groupRouter.post("/getGroupWithID", groupController.getGroupWithID); // coordinator
groupRouter.post("/getGroupInfo", groupController.getGroupInfo); // student
groupRouter.post("/getGroupMembers", groupController.getGroupMembers); // student
groupRouter.put("/delete", groupController.deletes); // admin, co
groupRouter.get("/all", groupController.getAll);
groupRouter.post("/createGroup", groupController.createGroup);
groupRouter.put("/statusgroup", groupController.statusgroup);
groupRouter.post("/getByRole", groupController.getByRole);
groupRouter.post("/listOwnGroup", groupController.listOwnGroup);
groupRouter.post("/getScoreCoor", groupController.getScoreCoor);
groupRouter.post("/socre", groupController.getGroupScore);
groupRouter.post("/getAllAdmin", groupController.getAllGroupsAdmin);

module.exports = groupRouter;
