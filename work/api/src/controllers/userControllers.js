const con = require("../config/db");
var xlsx = require("node-xlsx");
const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
const { result } = require("lodash");

getUser = async (req, res) => {
  res.status(200).json(req.user);
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
      const{Major,Senior} = req.body

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      let name = Date.now() + "_" + avatar.name
      avatar.mv("uploads/excel/" + name);
     
      var sql = "REPLACE INTO `users`(`User_Email`, `User_Identity_ID`, `User_Name`, `User_Role`, `Course_code`, `Major_ID`, `Project_on_term_ID`) VALUES (?,?,?,?,?,?,(SELECT `Project_on_term_ID` FROM `projectonterm` WHERE Academic_Year =? AND Academic_Term = ? AND Senior_Project = ?)) "
      
      var obj = readXlsxFile("uploads/excel/" + name).then(rows => {
        let semiter 
        let term 
        let coursec
        let errorcou = 0;
        for (let i = 8; i < rows.length; i++) {
          
          rows[i][0] = rows[i][1]+"@lamduan.mfu.ac.th"
          term =rows[1][0].split(" ")[4]
          semiter =  rows[1][0].split(" ")[6]
          if(term == "FIRST"){
            term=1
          }else if(term == "SECOND"){
            term=2
          }
          coursec = rows[4][0].split(" ")[4]
          
          con.query(
            sql,
            [
              rows[i][0],
              rows[i][1],
              rows[i][2],
              "1",
              coursec,
              Major,
              semiter,
              term,
              Senior,
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
                if(i==rows.length-1){
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
      const{Major,Senior} = req.body

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      let name = Date.now() + "_" + avatar.name
      avatar.mv("uploads/excel/" + name);
     
      var sql = "REPLACE INTO `users`(`User_Email`, `User_Identity_ID`, `User_Name`, `User_Role`, `Course_code`, `Major_ID`, `Project_on_term_ID`) VALUES (?,?,?,?,?,?,(SELECT `Project_on_term_ID` FROM `projectonterm` WHERE Academic_Year =? AND Academic_Term = ? AND Senior_Project = ?)) "
      
      var obj = readXlsxFile("uploads/excel/" + name).then(rows => {
        let semiter 
        let term 
        let coursec
        let errorcou = 0;
        for (let i = 8; i < rows.length; i++) {
          
          rows[i][0] = rows[i][1]+"@lamduan.mfu.ac.th"
          term =rows[1][0].split(" ")[4]
          semiter =  rows[1][0].split(" ")[6]
          if(term == "FIRST"){
            term=1
          }else if(term == "SECOND"){
            term=2
          }
          coursec = rows[4][0].split(" ")[4]
          
          // con.query(
          //   sql,
          //   [
          //     rows[i][0],
          //     rows[i][1],
          //     rows[i][2],
          //     "0",
          //     coursec,
          //     Major,
          //     semiter,
          //     term,
          //     Senior,
          //     rows[i][2],
          //     coursec
          //   ],
          //   (err, result, fields) => {
          //     if (err) {
                
          //       console.log(err.code);
          //       if (err.code == "ER_DUP_ENTRY") {
          //         res.status(500).send("Duplicate data");
          //       } else {
          //         res.status(500).send("Internal Server Error");
          //       }
          //     } else {
          //       if(i==rows.length-1){
          //         res.status(200).send("success");
          //       }
          //     }
          //   }
          // );
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
  uploadfileteacher,
  uploadfile,
  countUser,
  getUser
};
