const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { checkPermission } = require("../routes/permission");
const con = require("../config/db");

//Check authen login or not for all user
const checkAuthenticated = (req, res, next) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/logout");
  }
};

const checkAuthenticatedteacher = (req, res, next) => {
  next();
  // if (req.isAuthenticated()) {
  //   if (req.user.role == 0) {
  //     next();
  //   } else if (req.user.role == 1) {
  //     res.redirect("/api/auth/logout");
  //   } else if (req.user.role == 2) {
  //     next();
  //   } else if (req.user.role == 99) {
  //     next();
  //   } else {
  //     res.redirect("/logout");
  //   }
  // } else {
  //   res.redirect("/logout");
  // }
};

// const checkAuthenticatedStudent = (req, res, next) => {
//     console.log(req.user)
//     if (req.isAuthenticated()) {
//         if (req.user.role == 0) {
//             res.redirect("/")
//         }
//         else if (req.user.role == 1) {
//             next()
//         } else if (req.user.role == 2) {
//             res.redirect("/")
//         } else if (req.user.role == 99) {
//             res.redirect("/")
//         }
//     } else {
//         res.redirect("/")
//     }
// }

// const checkAuthenticatedcoor = (req, res, next) => {
//     console.log(req.user)
//     if (req.isAuthenticated()) {
//         if (req.user.role == 0) {
//             res.redirect("/")
//         }
//         else if (req.user.role == 1) {
//             res.redirect("/")
//         } else if (req.user.role == 2) {
//             next()
//         } else if (req.user.role == 99) {
//             res.redirect("/")
//         }
//     } else {
//         res.redirect("/")
//     }
// }

// const checkAuthenticatedadmin = (req, res, next) => {
//     console.log(req.user)
//     if (req.isAuthenticated()) {
//         if (req.user.role == 0) {
//             res.redirect("/")
//         }
//         else if (req.user.role == 1) {
//             res.redirect("/")
//         } else if (req.user.role == 2) {
//             res.redirect("/")
//         } else if (req.user.role == 99) {
//             next()
//         }
//     } else {
//         res.redirect("/")
//     }
// }

module.exports = {
  checkAuthenticated,
  checkAuthenticatedteacher,
  // checkAuthenticatedStudent,
  // checkAuthenticatedcoor,
  // checkAuthenticatedadmin
};

// //
