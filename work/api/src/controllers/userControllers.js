const con = require("../config/db");
var xlsx = require("node-xlsx");
const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
const { result } = require("lodash");


getUser = async (req, res) => {
  res.status(200).send(req.user);
};

countUser = async (req, res) => {
  const sql =
    "SELECT  (SELECT COUNT(*) FROM permission WHERE Permission_Role=0 OR Permission_Role=1 OR Permission_Role=2) AS student,(SELECT COUNT(*) FROM   permission WHERE Permission_Role=3) AS teacher,(SELECT COUNT(*) FROM   groups) AS groups";

  await con.query(sql, (err, result, fields) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
};

getAllUser = async (req, res) => {
  const sql = "SELECT * FROM `users`";

  await con.query(sql, (err, result, fields) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
};

addoneUser = async (req, res) => {
  const User_Identity_ID = req.body.User_Identity_ID;
  const User_Name = req.body.User_Name;
  const User_Email = req.body.User_Email;
  const User_Phone = req.body.User_Phone;
  const User_Role = req.body.User_Role;
  const Major_ID = req.body.Major_ID;
  const academic_term = req.body.academic_term;
  const year = req.body.year;
  var sql =
    "INSERT INTO users (`User_Identity_ID`, `User_Name`, `User_Email`, `User_Phone`, `User_Role`, `Major_ID`) VALUES(?,?,?,?,?,?) ";
    var sql2 = "INSERT INTO `permission`( `User_Status`, `User_Email`, `Permission_Role`, `Project_on_term_ID`) VALUES (1,?,1, (SELECT Project_on_term_ID from projectonterm WHERE Academic_Year =? AND Academic_Term = ?)) "
  await con.query(
    sql,
    [
      User_Identity_ID,
      User_Name,
      User_Email,
      User_Phone,
      User_Role,
      Major_ID,
      User_Identity_ID,
      User_Name,
      User_Phone,
      User_Role,
      Major_ID,

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
        con.query(
          sql2,
          [
            User_Email,
            year,
            academic_term,
          ],
          (err, result2, fields2) => {
            if (err) {
              console.log(err.code);

              res.status(500).send("Internal Server Error");
            } else {
              
                res.status(200).send("success");
              
            }
          }
        );
      }
    }
  );
};

editoneUser = async (req, res) => {
  const User_Identity_ID = req.body.User_Identity_ID;
  const User_Name = req.body.User_Name;
  const User_Email = req.body.User_Email;
  const User_Phone = req.body.User_Phone;
  const User_Role = req.body.User_Role;
  const Major_ID = req.body.Major_ID;
  const academic_term = req.body.academic_term;
  const year = req.body.year;
  var sql =
    "UPDATE `users` SET `User_Identity_ID`=?,`User_Name`=?,`User_Email`=?,`User_Phone`=?,`User_Role`= ?,`Major_ID`=? WHERE `User_Email`=?";
    var sql2 =
    "UPDATE `permission` SET `User_Status`=1,`Permission_Role`=1,`Project_on_term_ID`=(SELECT Project_on_term_ID from projectonterm WHERE Academic_Year =? AND Academic_Term = ?) WHERE `User_Email`=?";

  await con.query(
    sql,
    [
      year,
      academic_term,
      User_Email
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
        con.query(
          sql2,
          [
            User_Identity_ID,
            User_Name,
            User_Email,
            User_Phone,
            User_Role,
            Major_ID,
            User_Email
          ],
          (err, result, fields) => {
            if (err) {
                res.status(500).send("Internal Server Error");
            } else {
              res.status(200).send("success");
            }
          }
        );
      }
    }
  );
};

deleteuser = async (req, res) => {
  const User_Email = req.body.User_Email;
  const sql = "DELETE FROM `users` WHERE `users`.`User_Email` = ?";
  var sql2 =
    "UPDATE `permission` SET `User_Status`=0, WHERE `User_Email`=?";
  await con.query(sql, [User_Email], (err, result, fields) => {
    if (err) {
      console.log(err.code);
    } else {
      con.query(sql2, [User_Email], (err2, result, fields) => {
        if (err2) {
          console.log(err2.code);
        } else {
          res.status(200).send("success");
        }
      });
    }
  });
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

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      let name = Date.now() + "_" + avatar.name
      avatar.mv("uploads/" + name);
      var data = [];
      let count = 0;
      var sql2 = "INSERT INTO `permission`( `User_Status`, `User_Email`, `Permission_Role`, `Project_on_term_ID`) VALUES (1,?,1, (SELECT Project_on_term_ID from projectonterm WHERE Academic_Year =? AND Academic_Term = ?)) "
      var sql =
        "INSERT INTO users (`User_Identity_ID`, `User_Name`, `User_Email`, `User_Phone`, `User_Role`, `Major_ID`) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE User_Identity_ID=? , User_Name = ? , User_Phone = ? , User_Role = ? , Major_ID = ?;";
      var obj = readXlsxFile("uploads/" + name).then(rows => {
        for (let i = 1; i < rows.length; i++) {
          if (rows[i][4] == "teacher") {
            rows[i][4] = 0;
          } else {
            rows[i][4] = 1;
          }
          if (rows[i][5] == "CSI") {
            rows[i][5] = 1;
          } else if (rows[i][5] == "SE") {
            rows[i][5] = 1;
          } else if (rows[i][5] == "CE") {
            rows[i][5] = 1;
          } else if (rows[i][5] == "ICE") {
            rows[i][5] = 1;
          }
          // data.push(rows[i])]
          // console.log(rows[i][0])
          con.query(
            sql,
            [
              rows[i][0],
              rows[i][1],
              rows[i][2],
              rows[i][3],
              rows[i][4],
              rows[i][5],
              rows[i][0],
              rows[i][1],
              rows[i][3],
              rows[i][4],
              rows[i][5],

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

                con.query(
                  sql2,
                  [
                    rows[i][2],
                    rows[i][7],
                    rows[i][8],
                  ],
                  (err, result2, fields2) => {
                    if (err) {
                      console.log(err.code);

                      res.status(500).send("Internal Server Error");
                    } else {
                      count++;
                      if (count == rows.length - 1) {
                        res.status(200).send("success");
                      }
                    }
                  }
                );
                // res.status(200).send("success");

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
  getAllUser,
  addoneUser,
  uploadfile,
  deleteuser,
  editoneUser,
  countUser,
  getUser
};
