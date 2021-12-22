require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportSetup = require("./src/config/passport");
const multer = require("multer");
const mysql = require("mysql");
const config = require("./src/config/db");
var _ = require("lodash");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const announcRoutes = require("./src/routes/announcementRoutes");
const groupRoutes = require("./src/routes/groupRoutes");
const criteriaRoutes = require("./src/routes/criteriaRoutes");
const assignmentRoutes = require("./src/routes/assignmentRoutes");
const dateRoutes = require("./src/routes/dateRoutes");

const app = express();

// ============ Middleware ============
//cookie
app.use(
  cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: [process.env.COOKIEKEY]
  })
);

app.use(express.static(path.join(__dirname, "backend")));
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
// enable files upload

app.use(
  fileUpload({
    createParentPath: true
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//initialize passportt for se/deserialization
app.use(passport.initialize());

//session
app.use(passport.session());

// app.use(cors);

// ============ Routes ============
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/announc", announcRoutes);
app.use("/group", groupRoutes);
app.use("/criteria", criteriaRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/date", dateRoutes);
app.get("/test", (req, res) => {
  res.send("test");
});

// ============ Starting server ============
// const PORT = process.env.PORT || 3500;
// app.listen(PORT, () => {
//   console.log("Server is starting at port " + PORT);
// });

// ============ export server ============
module.exports = app;
