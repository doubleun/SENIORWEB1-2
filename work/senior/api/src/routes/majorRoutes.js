const MajorControllers = require("../controllers/majorController");
const majorRouter = require("express").Router();

majorRouter.get("/getAllActiveMajors", MajorControllers.getAllActiveMajors); // admin, cooridator
majorRouter.get("/getAllMajors", MajorControllers.getAllMajors); // admin
majorRouter.post("/add", MajorControllers.addMajor); // admin,
majorRouter.put("/update", MajorControllers.updateMajor); // admin,

module.exports = majorRouter;
