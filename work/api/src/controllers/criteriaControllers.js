const con = require("../config/db");

// Get all score criterias
getAllMajor = async (req, res) => {
  const sql = "SELECT * FROM `scorecriterias`";
  await con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// Get score criteria by major id
getByMajor = async (req, res) => {
  const majorId = req.body.Major_ID;
  const sql = "SELECT * FROM `scorecriterias` WHERE Major_ID = ?";
  await con.query(sql, [majorId], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// Edit score criterias
editCriteria = async (req, res) => {
  const majorId = req.body.Major_ID;
  const progressId = req.body.Progress_ID;
  const sql = "INSERT INTO scorecriterias()";
  await con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

module.exports = { getAllMajor, getByMajor, editCriteria };
