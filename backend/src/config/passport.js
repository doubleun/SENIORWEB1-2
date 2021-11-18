const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { checkPermission } = require('../routes/permission');
const con = require('../config/db')

// const mysql = require("mysql");
// const config = require("../dbConfig");
// const con = mysql.createConnection(config);
// // const checkDB="";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/redirect",
            // passReqToCallback: true
        },
        (accessToken, refreshToken, profile, done) => {
            // console.log(profile)
            // console.log(profile.displayName)
            // console.log(profile.emails[0].value);
            // console.log(profile.photos[0].value);

            const user = { name: profile.displayName, email: profile.emails[0].value, photo: profile.photos[0].value };

            done(null, user)

        })
);

passport.serializeUser((user, done) => {
    // console.log(user)
    done(null, user);
})

passport.deserializeUser((user, done) => {
    //TODO: generally, you must query for id in DB
    // done(null, id);
    // console.log(id.email)
    const sql = 'SELECT * ,DATE_FORMAT(proj.Access_Date_Start, "%Y-%m-%d ") As start ,DATE_FORMAT(proj.Access_Date_End, "%Y-%m-%d ") AS end FROM  permission perm INNER JOIN projectonterm proj ON perm.Project_on_term_ID=proj.Project_on_term_ID AND perm.User_Email =?'
    con.query(sql, user.email, (err, result, fields) => {
        if (err) {
            done(null, false);
            console.log('Internal Server Error')
            return "Internal Server Error"
        } else {
            if (result.length == 0) {
                done(null, false);
                console.log('Can not login, Please contact School of IT')
                return "Can not login, Please contact School of IT"
            } else {
                // console.log(result)
                var today = new Date();
                today = today.getFullYear() + '-' + parseInt(today.getMonth() + 1) + '-' + today.getDate()
                // console.log(today)

                // done(null, user);
                // console.log(result[0].Access_Date_Start)
                // console.log(result[0].Access_Date_End)
                // console.log(result[0].start)
                // console.log(result[0].end)
                console.log(result[0].start <= today)
                console.log(result[0].end >= today)
                if (result[0].start <= today && result[0].end >= today) {
                    done(null, user);
                } else {
                    done(null, false);
                    console.log('Can not login, Please contact School of IT')
                    return "Can not login, Please contact School of IT"
                }

            }
        }
    })


})
