const announcRouter = require("express").Router();
const announcController = require("../controllers/announcementControllers");

announcRouter.post("/", announcController.getById); // co, advisor, committee, student
announcRouter.get("/all", announcController.getAll); // admin
announcRouter.post("/add", announcController.add); // co, admin
announcRouter.post("/edit", announcController.edit); // co, admin
announcRouter.post("/delete", announcController.deletes); // co, admin

module.exports = announcRouter;
