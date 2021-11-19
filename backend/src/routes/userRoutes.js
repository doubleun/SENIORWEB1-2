const UserControllers = require("../controllers/userControllers")

var userRouter = require('express').Router();

// userRouter.get("/", UserControllers.addoneUser);
userRouter.get("/getalluser", UserControllers.getAllUser);
userRouter.post("/importuser", UserControllers.uploadfile);
userRouter.post("/adduser", UserControllers.addoneUser);
userRouter.delete("/deleteuser", UserControllers.deleteuser)
userRouter.put("/edituser", UserControllers.editoneUser)

module.exports = userRouter;