const con = require("../config/db");
var xlsx = require("node-xlsx");
const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
const { result } = require("lodash");

// TODO: Move this to its own route ?
getAllMajors = async (req, res) => {
  const sql =
    "SELECT * FROM `majors` WHERE `Major_Status` = 1 AND Major_ID !=99";
  con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// TODO: Move this to its own route ?
getTeacherRole = async (req, res) => {
  const sql = "SELECT * FROM `roles` WHERE Role_ID!=99 AND Role_ID!=1";
  con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

getUser = async (req, res) => {
  // Each request has 'user' embeded in there, and the passport.js middleware on the backend node.js server 'deserialize' it
  // That's why this just respond back the req.user
  res.status(200).json(req.user);
};

countUser = async (req, res) => {
  const { Project_on_term_ID } = req.body;
  const sql =
    "SELECT (SELECT COUNT(*) FROM users WHERE User_Role=1 AND Project_on_term_ID = ? ) AS student,(SELECT COUNT(*) FROM users WHERE User_Role=0 AND Project_on_term_ID = ? ) AS teacher,(SELECT COUNT(*) FROM  groups) AS groups";

  await con.query(
    sql,
    [Project_on_term_ID, Project_on_term_ID],
    (err, result, fields) => {
      if (err) {
        res.status(500).send("Internal Server Error");
      } else {
        // console.log(result[0]);
        res.status(200).json({
          students: result[0].student,
          teachers: result[0].teacher,
          groups: result[0].groups
        });
      }
    }
  );
};

getAllUserWithMajor = async (req, res) => {
  const { Major_ID, Academic_Year, Academic_Term, User_Role } = req.body;
  const sql =
    "SELECT * FROM users usr INNER JOIN projectonterm pj ON usr.Project_on_term_ID=pj.Project_on_term_ID WHERE usr.Major_ID=? AND pj.Academic_Year=? AND pj.Academic_Term=? AND usr.User_Role!=99 AND usr.User_Role IN (?)";

  console.log(req.body);

  await con.query(
    sql,
    [Major_ID, Academic_Year, Academic_Term, User_Role],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(result);
        res.status(200).json(result);
      }
    }
  );
};

getAllUsersInSchool = async (req, res) => {
  const { Project_on_term_ID } = req.body;
  const studentsSQL =
    "SELECT `User_Email`, `User_Identity_ID`, `User_Name`, `User_Role` FROM `users` WHERE `User_Role` = 1 AND `Project_on_term_ID` = ?";
  const students = await new Promise((resolve, reject) => {
    con.query(
      studentsSQL,
      [Project_on_term_ID],
      (err, studentsResult, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          resolve(studentsResult);
        }
      }
    );
  });
  const teachersSQL =
    "SELECT `User_Email`, `User_Identity_ID`, `User_Name`, `User_Role` FROM `users` WHERE `User_Role` = 0 AND `Project_on_term_ID` = ?";
  const teachers = await new Promise((resolve, reject) => {
    con.query(
      teachersSQL,
      [Project_on_term_ID],
      (err, teachersResult, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          resolve(teachersResult);
        }
      }
    );
  });
  res.status(200).json({ students, teachers, status: 200 });
};

uploadfile = async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files[""];
      const { Major, Senior } = req.body;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      let name = Date.now() + "_" + avatar.name;
      avatar.mv("uploads/excel/" + name);

      var sql =
        "REPLACE INTO users ( User_Email , User_Identity_ID , User_Name , User_Role , Course_code , Major_ID , Senior , Project_on_term_ID ) VALUES (?,?,?,?,?,?,(SELECT `Project_on_term_ID` FROM `projectonterm` WHERE Academic_Year =? AND Academic_Term = ? )) ";

      var obj = readXlsxFile("uploads/excel/" + name).then(rows => {
        let semiter;
        let term;
        let coursec;
        let errorcou = 0;
        for (let i = 8; i < rows.length; i++) {
          rows[i][0] = rows[i][1] + "@lamduan.mfu.ac.th";
          term = rows[1][0].split(" ")[4];
          semiter = rows[1][0].split(" ")[6];
          if (term == "FIRST") {
            term = 1;
          } else if (term == "SECOND") {
            term = 2;
          }
          coursec = rows[4][0].split(" ")[4];

          con.query(
            sql,
            [
              rows[i][0],
              rows[i][1],
              rows[i][2],
              "1",
              coursec,
              Major,
              Senior,
              semiter,
              term,

              rows[i][2],
              coursec
            ],
            (err, result, fields) => {
              if (err) {
                console.log(err.code);
                if (err.code == "ER_DUP_ENTRY") {
                  res.status(500).send("Duplicate data");
                } else {
                  res.status(500).send("Internal Server Error");
                }
              } else {
                if (i == rows.length - 1) {
                  res.status(200).send("success");
                }
                //
              }
            }
          );
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
};

uploadfileteacher = async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files[""];
      const { Major, Senior } = req.body;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      let name = Date.now() + "_" + avatar.name;
      avatar.mv("uploads/excel/" + name);
      var sql =
        "REPLACE INTO `users`(`User_Email`, `User_Identity_ID`, `User_Name`, `User_Role`, `Course_code`, `Major_ID`, Senior , `Project_on_term_ID`) VALUES (?,?,?,?,?,?,?,(SELECT `Project_on_term_ID` FROM `projectonterm` WHERE Academic_Year =? AND Academic_Term = ? )) ";

      var obj = readXlsxFile("uploads/excel/" + name).then(rows => {
        let semiter;
        let term;
        let coursec = null;
        let errorcou = 0;
        // console.log(rows[1][0])
        for (let i = 4; i < rows.length; i++) {
          console.log(rows[i]);
          // rows[i][0] = rows[i][1] + "@lamduan.mfu.ac.th";
          term = rows[1][0].split(" ")[4];
          semiter = rows[1][0].split(" ")[6];
          if (term == "FIRST") {
            term = 1;
          } else if (term == "SECOND") {
            term = 2;
          }
          if (rows[i][4] == "IT") {
            rows[i][4] = 1;
          } else if (rows[i][4] == "CSI") {
            rows[i][4] = 2;
          } else if (rows[i][4] == "MTA") {
            rows[i][4] = 3;
          } else if (rows[i][4] == "SE") {
            rows[i][4] = 4;
          } else if (rows[i][4] == "ICE") {
            rows[i][4] = 5;
          } else if (rows[i][4] == "CE") {
            rows[i][4] = 6;
          } else if (rows[i][4] == "DTBI") {
            rows[i][4] = 7;
          }
          con.query(
            sql,
            [
              rows[i][3],
              rows[i][1],
              rows[i][2],
              "0",
              coursec,
              rows[i][4],
              0,
              semiter,
              term
            ],
            (err, result, fields) => {
              if (err) {
                console.log(err.code);
                if (err.code == "ER_DUP_ENTRY") {
                  res.status(500).send("Duplicate data");
                } else {
                  res.status(500).send("Internal Server Error");
                }
              } else {
                if (i == rows.length - 1) {
                  res.status(200).send("success");
                }
              }
            }
          );
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
};

module.exports = {
  getAllUserWithMajor,
  getAllUsersInSchool,
  uploadfileteacher,
  uploadfile,
  countUser,
  getUser,
  getAllMajors,
  getTeacherRole
};
