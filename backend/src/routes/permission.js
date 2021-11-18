// require('dotenv').config();
const con = require('../config/db')
const Role = require('../config/role')


// Admin: 99,
// Coordinator: 0,
// Advisor: 1,
// Committee: 2,
// Student: 3,
// SeniorOne: 'One',
// SeniorOne: 'Two'

checkLogin = (req, res, next) => {

    if (!req.user) {
        res.redirect("/auth");
    }
    else {
        next();
    }
}

// checkRole = (req, res, role, next) => {
//     if (role === 99) {
//         next();
//     } else {
//         res.redirect(Role.);

//     }
// }

// checkAdmin = (req, res, role = '', senior = '', next) => {
//     if (role == 99) {
//         next();
//     } else {
//         res.redirect(Role.);

//     }
// }

module.exports = { checkLogin }

