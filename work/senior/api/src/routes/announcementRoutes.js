const announcRouter = require("express").Router();
const announcController = require("../controllers/announcementControllers");
const middle = require("../middleware/middle");

announcRouter.post("/major",middle.checkAuthenticated, announcController.getById); // co, advisor, committee, student
announcRouter.get("/all",middle.checkAuthenticated, announcController.getAll); // admin
announcRouter.post("/add",middle.checkAuthenticated, announcController.add); // co, admin
announcRouter.post("/edit",middle.checkAuthenticated, announcController.edit); // co, admin
announcRouter.delete("/delete",middle.checkAuthenticated, announcController.deletes); // co, admin

module.exports = announcRouter;
