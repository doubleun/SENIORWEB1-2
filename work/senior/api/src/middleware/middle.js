const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { checkPermission } = require("../routes/permission");
const con = require("../config/db");

//Check authen login or not for all user
const checkAuthenticated = (req, res, next) => {
  console.log("start check authenticate");
  if (!req.isAuthenticated()) {
    console.log("Unauthorized");
    res.status(403).end();

    // res.redirect("/logout");
    // res.status(403).json({ status: 403, msg: "Unauthorized" });
    // res.end();
  } else {
    next();
  }
};

// check role ex: accepted = [1, 99]
var checkRole = (accepted = []) => {
  console.log("start check role");
  // Role: student = 1, teacher = 0, coordinator = 2, admin = 99

  // TODO: don't hard code for role id
  // accepted = accepted.map((el) => {

  // });

  return (req, res, next) => {
    if (!accepted.includes(req.user.role)) {
      console.log("Invalid role");
      res.status(403).end();

      // res.redirect("http://localhost:3000/api/auth/logout");
      // res.status(403).json({ status: 404, msg: "access api error" });
    } else {
      next();
    }
  };
};

// check access date
const accessDate = (req, res, next) => {
  // Role: student = 1, teacher = 0, coordinator = 2, admin = 99

  // console.log("start check access date");
  // console.log("db date", req.user.accessDateEnd);
  // console.log("now  date ", new Date());
  // console.log("db date time", new Date(req.user.accessDateEnd).getTime());
  // console.log("now date time", new Date().getTime());
  // console.log(
  //   new Date(req.user.accessDateEnd).getTime() < new Date().getTime()
  // );

  if (req.user.role === 99) {
    return next();
  }

  if (new Date(req.user.accessDateEnd).getTime() < new Date().getTime()) {
    console.log("Invalid access");
    res.status(403).end();
    // res.redirect(403, "/logout");
    // res.status(403).json({ status: 404, msg: "access api error" });
  } else {
    next();
  }
};

module.exports = {
  checkAuthenticated,
  checkRole,
  accessDate,
};
