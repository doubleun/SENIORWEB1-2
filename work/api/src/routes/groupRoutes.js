<<<<<<< Updated upstream
const groupRouter = require('express').Router()
const groupController = require('../controllers/groupControllers')

groupRouter.get('/getByMajor', groupController.getByMajor) // addmin, co, advisor, committee
groupRouter.get('/delete', groupController.deletes) // admin, co
groupRouter.get('/all', groupController.getAll)
groupRouter.post('/createGroup', groupController.createGroup)
groupRouter.put('/statusgroup', groupController.statusgroup)
groupRouter.post('/getByRole', groupController.getByRole)


module.exports = groupRouter
=======
const groupRouter = require("express").Router();
const groupController = require("../controllers/groupControllers");

groupRouter.get("/getByMajor", groupController.getByMajor); // addmin, co, advisor, committee
groupRouter.get("/delete", groupController.deletes); // admin, co
groupRouter.get("/all", groupController.getAll);
groupRouter.post("/createGroup", groupController.createGroup);
groupRouter.put("/statusgroup", groupController.statusgroup);
groupRouter.post("/getByRole", groupController.getByRole);
groupRouter.post("/listOwnGroup", groupController.listOwnGroup);
groupRouter.post("/getScoreCoor", groupController.getScoreCoor);
groupRouter.post("/socre", groupController.getGroupScore);
groupRouter.post("/getAllAdmin", groupController.getAllGroupsAdmin);

module.exports = groupRouter;
>>>>>>> Stashed changes
