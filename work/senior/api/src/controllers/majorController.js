const con = require("../config/db");

getAllActiveMajors = (req, res) => {
  const getMajor =
    "SELECT * FROM `majors` WHERE `Major_Status` = 1 AND Major_ID !=99";
  con.query(getMajor, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

getAllMajors = (req, res) => {
  const getMajor = "SELECT * FROM `majors` WHERE Major_ID !=99";
  con.query(getMajor, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

addMajor = (req, res) => {
  const { Major_Name, Acronym } = req.body;
  const addNewMajor =
    "INSERT INTO `majors` ( `Major_Name`, `Acronym`) VALUES ( ?, ?);";
  con.query(addNewMajor, [Major_Name, Acronym], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json({ msg: "Add major successed", status: 200 });
    }
  });
};

updateMajor = (req, res) => {
  const { Major_Name, Acronym, Major_Status, Major_ID } = req.body;
  const updateMajor =
    "UPDATE `majors` SET `Major_Name` = ?, `Acronym` = ?, `Major_Status` = ? WHERE `majors`.`Major_ID` = ?";
  con.query(
    updateMajor,
    [Major_Name, Acronym, Major_Status, Major_ID],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).json({ msg: "Update successed", status: 200 });
      }
    }
  );
};

module.exports = {
  getAllActiveMajors,
  getAllMajors,
  addMajor,
  updateMajor,
};
