require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { checkPermission } = require("../routes/permission");
const con = require("../config/db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/redirect"
      // passReqToCallback: true
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(profile)
      // console.log(profile.displayName)
      // console.log(profile.emails[0].value);
      // console.log(profile.photos[0].value);

      const user = {
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
      };

      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  const sqlAdmin = "SELECT * FROM `users` WHERE User_Email=?";
  con.query(sqlAdmin, user.email, (err, result, fields) => {
    if (err) {
      data = { message: "Internal Server Error" };
      done(null, data);
      console.log(err);
      console.log("Internal Server Error");
    } else {
      // console.log(result);
      if (result.length == 0) {
        data = { message: "Cant find user in database" };
        done(null, data);
        console.log("Cant find user in database");
      } else {
        user.role = result[0].User_Role;
        user.major = result[0].Major_ID;
        // console.log("Serialize: ", user);
        done(null, user);
        // if (result[0].User_Role == 99) {
        //   user.role = result[0].User_Role;
        //   done(null, user);
        // } else {
        //   normalUser();
        // }
      }
    }
  });

  function normalUser() {
    const sql =
      'SELECT * ,DATE_FORMAT(proj.Access_Date_Start, "%Y-%m-%d ") As start ,DATE_FORMAT(proj.Access_Date_End, "%Y-%m-%d ") AS end FROM  permission perm INNER JOIN projectonterm proj ON perm.Project_on_term_ID=proj.Project_on_term_ID AND perm.User_Email =?';
    con.query(sql, user.email, (err, result, fields) => {
      if (err) {
        data = { message: "Internal Server Error" };
        done(null, data);
        console.log(err);
        console.log("Internal Server Error");
      } else {
        // console.log(result);
        if (result.length == 0) {
          data = { message: "Can not login, Please contact School of IT" };
          done(null, data);
          console.log("Can not login, Please contact School of IT");
        } else {
          // console.log(result)
          var today = new Date();
          today =
            today.getFullYear() +
            "-" +
            parseInt(today.getMonth() + 1) +
            "-" +
            today.getDate();
          console.log(result[0].start <= today);
          console.log(result[0].end >= today);
          if (result[0].start <= today && result[0].end >= today) {
            user.role = result[0].Permission_Role;
            done(null, user);
          } else {
            data = { message: "Can not login, Please contact School of IT" };
            done(null, data);
            console.log("Can not login, Please contact School of IT");
          }
        }
      }
    });
  }
});

passport.deserializeUser((user, done) => {
  done(null, user);
});