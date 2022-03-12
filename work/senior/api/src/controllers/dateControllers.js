const con = require("../config/db");

// Get latest project on term id
getLatestProjectOnTerm = (req, res) => {
  const getLatestProjectOnTermSql =
    "SELECT * FROM `projectonterm` ORDER BY `Project_on_term_ID` DESC LIMIT 1";
  try {
    con.query(getLatestProjectOnTermSql, (err, projectOnTerm) => {
      if (err) throw err;
      res.status(200).json(projectOnTerm[0]);
      return;
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
    return;
  }
};

// Academic year
getAcademicYear = async (req, res) => {
  const sql =
    "SELECT * FROM `academicyear` ORDER BY `Academic_Year` DESC LIMIT 1";
  con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

newAcademicYear = async (req, res) => {
  const { year } = req.body;

  const sql = "INSERT INTO `academicyear`(`Academic_Year`) VALUES (?)";
  con.query(sql, [year], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(422).json({ msg: "Query Error", err });
    } else {
      res.status(200).json({ msg: "Query Error", status: 200, result });
    }
  });
};

// Semester date
getSemesterDate = async (req, res) => {
  const { year } = req.body;
  const sql =
    "SELECT * FROM `projectonterm` WHERE `Academic_Year` = ? ORDER BY `Project_on_term_ID`";
  con.query(sql, [year], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

newSemesterDate = async (req, res) => {
  // const {Academic_Year, Academic_Term, Date_Start, Date_End} = req.body
  console.log(req.body.data);
  const { data } = req.body;
  const sql =
    "INSERT IGNORE INTO `projectonterm`(`Academic_Year`, `Academic_Term`, `Access_Date_Start`, `Access_Date_End`) VALUES ?";
  con.query(
    sql,
    [data.map((obj) => Object.values(obj))],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(422).json({ msg: "Query Error", err });
      } else {
        res.status(200).json({ msg: "Query Error", status: 200, result });
      }
    }
  );
};

updateSemesterDate = async (req, res) => {
  // data is an array that has 'Access_Date_Start, Access_Date_End, Project_on_term_ID' respectively
  let { data } = req.body;

  // Update semester date
  const update =
    "UPDATE `projectonterm` SET `Access_Date_Start`=?, `Access_Date_End`=? WHERE `Project_on_term_ID` = ?";
  con.query(update, data, (err, result, fields) => {
    try {
      if (err) throw err;
    } catch (err) {
      res.status(422).json({ msg: "Query Error", status: 422 });
    }
  });
  res.status(200).json({ msg: "success", status: 200 });
};

// Get all available years and semester for Admin
getYearsSemester = async (req, res) => {
  const sql =
    "SELECT `Academic_Year`, `Academic_Term` FROM `projectonterm` ORDER BY Academic_Year DESC ";
  con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

module.exports = {
  getLatestProjectOnTerm,
  getAcademicYear,
  newAcademicYear,
  getSemesterDate,
  newSemesterDate,
  updateSemesterDate,
  getYearsSemester,
};
