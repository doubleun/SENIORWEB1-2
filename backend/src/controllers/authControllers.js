// ไว้แยก role ปี senior 1 หรือ 2
const router = require("express").Router();
const passport = require("passport");

login = passport.authenticate('google', {
    scope: ['email', 'profile']
});

redirect = passport.authenticate('google', {
    successRedirect: '/user',
    failureRedirect: '/auth',
    failureFlash: true
    // req.flash('success_msg', 'Successfully Registered')
});


//log out
logout = (req, res) => {
    req.logOut();
    res.redirect("/");
}

// test
test = (req, res) => {
    res.send('login')
}

module.exports = {
    login,
    redirect,
    logout,
    test
};