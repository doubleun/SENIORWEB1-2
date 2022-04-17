const announcRouter = require("express").Router();
const announcController = require("../controllers/announcementControllers");
const middle = require("../middleware/middle");

announcRouter.post(
  "/major",
  [middle.checkAuthenticated, middle.checkRole([0, 1, 2])],
  announcController.getByMajorId
); // co, advisor, committee, student
announcRouter.post(
  "/all",
  [middle.checkAuthenticated, middle.checkRole([99])],
  announcController.getAll
); // admin
announcRouter.post(
  "/add",
  [
    middle.checkAuthenticated,
    middle.checkRole([2, 99]),
    // middle.checkAccessDate,
  ],
  announcController.add
); // co, admin
announcRouter.post(
  "/edit",
  [middle.checkAuthenticated, middle.checkRole([2, 99])],
  announcController.edit
); // co, admin
announcRouter.delete(
  "/delete",
  [middle.checkAuthenticated, middle.checkRole([2, 99])],
  announcController.deletes
); // co, admin

module.exports = announcRouter;
