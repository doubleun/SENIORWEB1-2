const announcRouter = require("express").Router();
const announcController = require("../controllers/announcementControllers");
const middle = require("../middleware/middle");

announcRouter.post("/major",middle.checkAuthenticated, announcController.getById); // co, advisor, committee, student
announcRouter.get("/all",middle.checkAuthenticatedteacher, announcController.getAll); // admin
announcRouter.post("/add",middle.checkAuthenticatedteacher, announcController.add); // co, admin
announcRouter.post("/edit",middle.checkAuthenticatedteacher, announcController.edit); // co, admin
announcRouter.delete("/delete",middle.checkAuthenticatedteacher, announcController.deletes); // co, admin

module.exports = announcRouter;
