const con = require("../config/db");

// get progression of dua date by major
getProgressionDuedate = async (req, res) => {
  const { Major_ID, Project_on_term_ID } = req.body;
  // const Project_on_term_ID = req.params.Project_on_term_ID
  const sql =
    "SELECT * FROM `progressionsinfo` WHERE Major_ID=? AND Project_on_term_ID=?";
  const semDate =
    "SELECT * FROM `projectonterm` WHERE Project_on_term_ID=?";

  await con.query(
    semDate,
    [Project_on_term_ID],
    (err, semDate, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        if (semDate.length == 0) {
          res.status(200).json({ 'projectOnTerm': semDate })
        } else {
          con.query(
            sql,
            [Major_ID, Project_on_term_ID],
            (err, result, fields) => {
              if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
              } else {
                res.status(200).json({ 'progressionDuedate': result, 'projectOnTerm': semDate });

              }
            }
          );
        }
      }
    }
  );

  // await con.query(
  //   sql,
  //   [Major_ID, Project_on_term_ID],
  //   (err, result, fields) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).send("Internal Server Error");
  //     } else {



  //     }
  //   }
  // );
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
    "INSERT INTO `progressionsinfo` ( `DueDate_Start`, `DueDate_End`, `Progress_ID`, `Major_ID`, `Project_on_term_ID`) VALUES (?,?,(SELECT Progress_ID FROM progressions WHERE Progress_Name = ?),?,?);";
  const update =
    "UPDATE `progressionsinfo` SET `DueDate_Start` = ?, `DueDate_End` = ?, `Progress_ID` = (SELECT Progress_ID FROM progressions WHERE Progress_Name = ?) , `Major_ID` = ?, `Project_on_term_ID` = ? WHERE `progressionsinfo`.`Progression_Info_ID` = ?;";

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

newSemesterDate = async (req, res) => {
  // const {Academic_Year, Academic_Term, Date_Start, Date_End} = req.body
  console.log(req.body.data);
  const { data } = req.body;
  const sql =
    "INSERT IGNORE INTO `projectonterm`(`Academic_Year`, `Academic_Term`, `Access_Date_Start`, `Access_Date_End`, `Senior_Project`) VALUES ?";
  con.query(
    sql,
    [data.map(obj => Object.values(obj))],
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
  getProgressionDuedate,
  updateProgressionDuedate,
  getSemesterDate,
  newSemesterDate,
  updateSemesterDate,
  getYearsSemester
};
