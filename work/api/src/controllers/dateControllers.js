const con = require("../config/db");

// get progression of dua date by major
getProgressionDuedate = async (req, res) => {
  const { Major_ID, Project_on_term_ID } = req.body;
  // const Project_on_term_ID = req.params.Project_on_term_ID
  const sql =
    "SELECT * FROM `progressionsinfo` WHERE Major_ID=? AND Project_on_term_ID=?";
  await con.query(
    sql,
    [Major_ID, Project_on_term_ID],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).json(result);
      }
    }
  );
};

// update progression duedate
updateProgressionDuedate = async (req, res) => {
  // if no progression data,
  //      fontend must send Progression_Info_ID=0 to backend,
  //      if have progression data send Progression_Info_ID to backend

  const {
    DueDate_Start,
    DueDate_End,
    Progress_ID,
    Major_ID,
    Project_on_term_ID,
    Progression_Info_ID
  } = req.body;
  const insert =
    "INSERT INTO `progressionsinfo` ( `DueDate_Start`, `DueDate_End`, `Progress_ID`, `Major_ID`, `Project_on_term_ID`) VALUES (?,?,?,?,?);";
  const update =
    "UPDATE `progressionsinfo` SET `DueDate_Start` = ?, `DueDate_End` = ?, `Progress_ID` = ?, `Major_ID` = ?, `Project_on_term_ID` = ? WHERE `progressionsinfo`.`Progression_Info_ID` = ?;";

  if (Progression_Info_ID == 0) {
    await con.query(
      insert,
      [DueDate_Start, DueDate_End, Progress_ID, Major_ID, Project_on_term_ID],
      (err, insert, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.status(200).send("insert");
        }
      }
    );
  } else {
    await con.query(
      update,
      [
        DueDate_Start,
        DueDate_End,
        Progress_ID,
        Major_ID,
        Project_on_term_ID,
        Progression_Info_ID
      ],
      (err, insert, fields) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.status(200).send("updated");
        }
      }
    );
  }
};

getSemesterDate = async (req, res) => {
  const sql =
    "SELECT * FROM `projectonterm` ORDER BY `Project_on_term_ID` DESC LIMIT 2";
  con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

updateSemesterDate = async (req, res) => {
  let {
    Project_on_term_ID,
    Academic_Year,
    Academic_Term,
    Access_Date_Start,
    Access_Date_End,
    Senior_Project
  } = req.body;

  Access_Date_Start = new Date(Access_Date_Start);
  Access_Date_End = new Date(Access_Date_End);

  // Update semester date
  if (Project_on_term_ID) {
    const update =
      "UPDATE projectonterm SET `Academic_Year`=?, `Academic_Term`=?, `Access_Date_Start`=?, `Access_Date_End`=?, `Senior_Project`=? WHERE `Project_on_term_ID` = ?";
    con.query(
      update,
      [
        Academic_Year,
        Academic_Term,
        Access_Date_Start,
        Access_Date_End,
        Senior_Project,
        Project_on_term_ID
      ],
      (err, result, fields) => {
        try {
          if (err) throw err;
        } catch (err) {
          res.status(422).json({ msg: "Query Error" });
        }
      }
    );
    res.status(200).json({ msg: "success" });
  } else {
    // Insert new semester date
    const insert =
      "INSERT INTO projectonterm(Academic_Year, Academic_Term, Access_Date_Start, Access_Date_End, Senior_Project) VALUES(?, ?, ?, ?, ?)";
    con.query(
      insert,
      [
        Academic_Year,
        Academic_Term,
        Access_Date_Start,
        Access_Date_End,
        Senior_Project
      ],
      (err, result, fields) => {
        try {
          if (err) throw err;
        } catch (err) {
          res.status(422).json({ msg: "Query Error" });
        }
      }
    );
    res.status(200).json({ msg: "success" });
  }
};

// Get all available years and semester for Admin
getYearsSemester = async (req, res) => {
  const sql = "SELECT `Academic_Year`, `Academic_Term` FROM `projectonterm` ORDER BY Academic_Year DESC ";
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
  getProgressionDuedate,
  updateProgressionDuedate,
  getSemesterDate,
  updateSemesterDate,
  getYearsSemester
};
