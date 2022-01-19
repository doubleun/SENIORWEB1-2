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

// TODO: check req.user.role with role of api
checkLogin = (req, res, next) => {
    if (!req.user) {
        console.log('not login')
        res.redirect("/auth");
    }
    else {
        next();
    }
}



module.exports = { checkLogin }

