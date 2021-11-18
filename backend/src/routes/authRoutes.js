const authRouter = require('express').Router();
const authControllers = require("../controllers/authControllers");
const { checkPermission, checkLogin } = require('./permission');

authRouter.get('/', authControllers.test);
authRouter.get('/google', authControllers.login);
authRouter.get('/logout', authControllers.logout);
authRouter.get('/google/redirect', authControllers.redirect);

module.exports = authRouter;

// // ไว้แยก role ปี senior 1 หรือ 2
// const router = require("express").Router();
// const passport = require("passport");

// router.get('/google',
//     passport.authenticate('google', {
//         scope: ['email', 'profile']
//     }));
// router.get('/google/callback', passport.authenticate('google', {
//     successRedirect: '/',
//     failureRedirect: '/senior'
// }));


// //log out
// router.get("/", (req, res) => {
//     res.send('auth');
// })
// router.get("/logout", (req, res) => {
//     req.logOut();
//     res.redirect("/");
// })

// module.exports = router;