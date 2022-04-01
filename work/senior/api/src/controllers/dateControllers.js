const con = require("../config/db");

// Get latest project on term id
getLatestProjectOnTerm = async (req, res) => {
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

// Get project on term id from senior, semester and year
getProjectOnTerm = async (req, res) => {
  const { Academic_Year, Academic_Term, Senior } = req.body;
  const getProjectOnTermSql =
    "SELECT * FROM `projectonterm` WHERE Academic_Year = ? AND Academic_Term = ? AND Senior = ?";
  try {
    con.query(
      getProjectOnTermSql,
      [Academic_Year, Academic_Term, Senior],
      (err, projectOnTerm) => {
        if (err) throw err;
        res.status(200).json(projectOnTerm[0]);
        return;
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
    return;
  }
};

// Academic year
getAcademicYear = (req, res) => {
  const sql =
    "SELECT * FROM `academicyear` ORDER BY `Academic_Year` DESC LIMIT 1";
  con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    } else {
      res.status(200).json(result);
      return;
    }
  });
};

newAcademicYear = (req, res) => {
  const { year } = req.body;

  const sql = "INSERT INTO `academicyear`(`Academic_Year`) VALUES (?)";
  con.query(sql, [year], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(422).json({ msg: "Query Error", err });
      return;
    } else {
      res.status(200).json({ msg: "Query Error", status: 200, result });
      return;
    }
  });
};

// Semester date
getSemesterDate = (req, res) => {
  const { year, senior } = req.body;
  const sql =
    "SELECT * FROM `projectonterm` WHERE `Academic_Year` = ? AND `Senior` = ? ORDER BY `Project_on_term_ID`";
  con.query(sql, [year, senior], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    } else {
      res.status(200).json(result);
      return;
    }
  });
};

newSemesterDate = (req, res) => {
  const { data } = req.body;
  // TODO: Refactor, this used to be multiple insertion, but now it's one at a time
  const sql =
    "INSERT IGNORE INTO `projectonterm`(`Academic_Year`, `Academic_Term`, `Access_Date_Start`, `Access_Date_End`, `Senior`) VALUES ?";
  con.query(
    sql,
    [data.map((obj) => Object.values(obj))],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(422).json({ msg: "Query Error", err });
        return;
      } else {
        res.status(200).json({ msg: "Query Error", status: 200, result });
        return;
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
      return;
    }
  });
  res.status(200).json({ msg: "success", status: 200 });
  return;
};

// Get all available years, semester and senior for Admin
getYearsSemester = (req, res) => {
  try {
    const getSemesterDataSql =
      "SELECT `Academic_Year`, `Academic_Term`, `Senior` FROM `projectonterm` ORDER BY Academic_Year DESC";
    con.query(getSemesterDataSql, (err, result) => {
      if (err) throw err;
      res.status(200).json(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
    return;
  }
};

module.exports = {
  getLatestProjectOnTerm,
  getProjectOnTerm,
  getAcademicYear,
  newAcademicYear,
  getSemesterDate,
  newSemesterDate,
  updateSemesterDate,
  getYearsSemester,
};
