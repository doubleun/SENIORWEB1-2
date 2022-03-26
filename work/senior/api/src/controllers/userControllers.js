const con = require("../config/db");
var xlsx = require("node-xlsx");
const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
const { result } = require("lodash");

// TODO: Move this to its own route ?
getTeacherRole = (req, res) => {
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

updateUserRole = (req, res) => {
  const { User_Role, User_Email, Project_on_term_ID } = req.body;
  const updateUserRoleSql =
    "UPDATE users SET User_Role = ? WHERE User_Email = ? AND Project_on_term_ID = ?";
  try {
    con.query(
      updateUserRoleSql,
      [User_Role, User_Email, Project_on_term_ID],
      (err, result) => {
        if (err) throw err;
        res
          .status(200)
          .json({ msg: "Update successfully", res: result, status: 200 });
        return;
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
    return;
  }
};

getUser = (req, res) => {
  // Each request has 'user' embeded in there, and the passport.js middleware on the backend node.js server 'deserialize' it
  // That's why this just respond back the req.user
  res.status(200).json(req.user);
  return;
};


// FIXME: get req.body be year sem senior 
countUser = (req, res) => {
  const { Project_on_term_ID } = req.body;
  const sql =
    "SELECT (SELECT COUNT(*) FROM users WHERE User_Role=1 AND Project_on_term_ID = ? ) AS student,(SELECT COUNT(*) FROM users WHERE User_Role=0 AND Project_on_term_ID = ? ) AS teacher,(SELECT COUNT(*) FROM  groups) AS groups";

  con.query(
    sql,
    [Project_on_term_ID, Project_on_term_ID],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        // console.log(result[0]);
        res.status(200).json({
          students: result[0].student,
          teachers: result[0].teacher,
          groups: result[0].groups,
        });
      }
    }
  );
};

getAllUserWithMajor = (req, res) => {
  const { Major_ID, Academic_Year, Academic_Term, User_Role } = req.body;
  const sql =
    "SELECT * FROM users usr INNER JOIN projectonterm pj ON usr.Project_on_term_ID=pj.Project_on_term_ID WHERE usr.Major_ID=? AND pj.Academic_Year=? AND pj.Academic_Term=? AND usr.User_Role!=99 AND usr.User_Role IN (?)";

  console.log(req.body);

  con.query(
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
  // const { Project_on_term_ID } = req.body;
  const studentsSQL =
    "SELECT `User_Email`, `User_Identity_ID`, `User_Name`, `User_Role` FROM `users` WHERE `User_Role` = 1 AND `Project_on_term_ID` = ?";
  const students = await new Promise((resolve, reject) => {
    con.query(
      studentsSQL,
      [req.user.projectOnTerm],
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
    "SELECT `User_Email`, `User_Identity_ID`, `User_Name`, `User_Role` FROM `users` WHERE `User_Role` = 0 OR `User_Role` = 2 AND `Project_on_term_ID` = ?";
  const teachers = await new Promise((resolve, reject) => {
    con.query(
      teachersSQL,
      [req.user.projectOnTerm],
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
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file

      let name = req.files[0]["filename"];
      const { Major } = req.body;
      var sql =
        "INSERT IGNORE INTO users ( User_Email , User_Identity_ID , User_Name , User_Role , Course_code , Major_ID ,  Project_on_term_ID ) VALUES (?,?,?,?,?,?,(SELECT `Project_on_term_ID` FROM `projectonterm` WHERE Academic_Year =? AND Academic_Term = ? )) ";

      var obj = readXlsxFile(req.files[0]["path"]).then((rows) => {
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
              1,
              coursec,
              req.body["Major"],
              semiter,
              term,

              rows[i][2],
              coursec,
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
                if (result.affectedRows == 0) {
                  errorcou++;
                }
                if (i == rows.length - 1) {
                  if (errorcou == 0) {
                    res.status(200).send("success");
                  } else if (errorcou == rows.length - 1) {
                    res.status(200).send("noeffect");
                  } else {
                    res.status(200).send("someproblem");
                  }
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

uploadfileteacher = async (req, res) => {
  try {
    console.log(req.files[0]);
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      // let avatar = req.files;
      // const { Senior } = req.body;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      let name = req.files[0]["filename"];
      // avatar.mv("uploads/excel/" + name);
      // console.log(req.files[0]['filename'])
      var sql =
        "INSERT IGNORE INTO `users`(`User_Email`, `User_Identity_ID`, `User_Name`, `User_Role`, `Course_code`, `Major_ID` , `Project_on_term_ID`) VALUES (?,?,?,?,?,(SELECT Major_ID FROM majors WHERE Acronym = ?),(SELECT `Project_on_term_ID` FROM `projectonterm` WHERE Academic_Year =? AND Academic_Term = ? )) ";

      var obj = readXlsxFile(req.files[0]["path"]).then((rows) => {
        let semiter;
        let term;
        let coursec = null;
        let errorcou = 0;
        console.log(rows);
        for (let i = 4; i < rows.length; i++) {
          console.log(rows[i]);
          // rows[i][0] = rows[i][1] + "@lamduan.mfu.ac.th";
          if (
            rows[0][0] ==
            "รายชื่อบุคคลากร สำนักวิชาเทคโนโลยีสารสนเทศ มหาวิทยาลัยแม่ฟ้าหลวง"
          ) {
            term = rows[1][0].split(" ")[4];
            semiter = rows[1][0].split(" ")[6];
            if (term == "FIRST") {
              term = 1;
            } else if (term == "SECOND") {
              term = 2;
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
                semiter,
                term,
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
                  console.log(result.affectedRows);
                  if (result.affectedRows == 0) {
                    errorcou++;
                  }
                  if (i == rows.length - 1) {
                    if (errorcou == 0) {
                      res.status(200).send("success");
                    } else if (errorcou == rows.length - 1) {
                      res.status(200).send("noeffect");
                    } else {
                      res.status(200).send("someproblem");
                    }
                  }
                }
              }
            );
          } else {
            res.status(400).send("Wrong data");
            break;
          }
        }
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err, status: 500 });
    console.log(err);
    return;
  }
};

getUserProjectOnTerm = (req, res) => {
  const { User_Email, Major_ID, senior } = req.body;
  console.log(User_Email, Major_ID, senior);
  try {
    // TODO: get lastest project on term
    const getUserSeniorSql =
      "SELECT u.Project_on_term_ID, pj.Senior, pj.Access_Date_End FROM `users` u INNER JOIN projectonterm pj ON u.Project_on_term_ID = pj.Project_on_term_ID WHERE u.User_Email = ? AND u.Major_ID = ? AND pj.Senior = ?";
    con.query(
      getUserSeniorSql,
      [User_Email, Major_ID, senior],
      (err, result, fields) => {
        if (err) throw err;
        req.user.accessDateEnd = result[0].Access_Date_End;
        req.user.senior = senior;
        req.user.projectOnTerm = result[0].Project_on_term_ID;
        res.status(200).json(result);
        return;
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
    // res.status(500).json({ msg: err, status: 500 });
    return;
  }
};

module.exports = {
  getAllUserWithMajor,
  getAllUsersInSchool,
  uploadfileteacher,
  uploadfile,
  countUser,
  getUser,
  updateUserRole,
  getTeacherRole,
  getUserProjectOnTerm,
};
