// ไว้แยก role ปี senior 1 หรือ 2
const router = require("express").Router();
const passport = require("passport");

login = passport.authenticate("google", {
  scope: ["email", "profile"]
});

redirect = passport.authenticate("google", {
  successRedirect: "/api/user",
  failureRedirect: "/"
});

//log out
logout = (req, res) => {
  req.logOut();
  res.redirect("/auth");
};

// test
test = (req, res) => {
  res.send(req.data);
};

module.exports = {
  login,
  redirect,
  logout,
  test
};
