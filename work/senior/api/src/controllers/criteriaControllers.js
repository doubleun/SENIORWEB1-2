const { json } = require("express");
const con = require("../config/db");

//* === Score criteria === *//
// Get all score criterias
getScoreAllMajor = async (req, res) => {
  const sql = "SELECT * FROM `scorecriterias`";
  con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// Get latest projectOnTerm score criteria by major id (ie. current semester criteria)
getScoreByMajor = (req, res) => {
  // If only available is true, then only progress with total of more than 0 will be return
  const { Major_ID, Project_on_term_ID, onlyAvailable } = req.body;
  // Send query to fetch score criterias available in scorecriteria table, based on latest project_on_term_id
  const getScoreQuery = `SELECT Score_criteria_ID, Advisor_Score, Committee_Score, Major_ID, (SELECT Progress_ID FROM progressions WHERE progressions.Progress_ID = scorecriterias.Progress_ID) AS Progress_ID, (SELECT Progress_Name FROM progressions WHERE progressions.Progress_ID = scorecriterias.Progress_ID) AS Progress_Name, Sub_Progress_ID, Project_on_term_ID, Advisor_Score + Committee_Score AS Total FROM scorecriterias WHERE Major_ID = ? AND Project_on_term_ID = ? ${
    onlyAvailable ? "AND NOT Advisor_Score + Committee_Score = 0" : ""
  } ORDER BY Progress_ID ASC`;
  try {
    con.query(
      getScoreQuery,
      [Major_ID, Project_on_term_ID],
      (err, scoreCriteriasResult, fields) => {
        if (err) throw err;

        // If only request for progress that has total of more than 0, then we don't need to fill missing progress with template
        if (onlyAvailable) {
          res.status(200).json(scoreCriteriasResult);
          return;
        } else {
          // This will check and fill in any missing progress
          // List of criterias needed to return
          const scoreCriteriasTemplate = [
            "Progress 1",
            "Progress 2",
            "Progress 3",
            "Progress 4",
            "Final Presentation",
            "Final Documentation",
          ];
          // Check and fill scoreCriterias with missing progress in database
          for (let i = 0; i < scoreCriteriasTemplate.length; i++) {
            const existsProgress = scoreCriteriasResult.map(
              (itm) => itm.Progress_Name
            );
            // Look for progress that does not exists in the score criterias, and add them
            !existsProgress.includes(scoreCriteriasTemplate[i]) &&
              scoreCriteriasResult.push({
                Advisor_Score: 0,
                Committee_Score: 0,
                Major_ID,
                Progress_Name: scoreCriteriasTemplate[i],
                Progress_ID: i + 3,
                Project_on_term_ID,
                Score_criteria_ID: null,
                Sub_Progress_ID: null,
                Total: 0,
              });
          }
          res.status(200).json(scoreCriteriasResult);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", status: 500 });
  }
};

// Edit score criterias
editScoreCriteria = (req, res) => {
  const {
    Score_criteria_ID,
    Advisor_Score,
    Committee_Score,
    Major_ID,
    Progress_ID,
    Sub_Progress_ID,
    Project_on_term_ID,
  } = req.body;
  try {
    // Update score criteria if "Score_criteria_ID" exists
    if (Score_criteria_ID) {
      const updateScoreCriteria =
        "UPDATE scorecriterias SET `Advisor_Score`=?, `Committee_Score`=?, `Major_ID`=?, `Progress_ID`=?, `Sub_Progress_ID`=? WHERE `Score_criteria_ID` = ?";
      con.query(
        updateScoreCriteria,
        [
          Advisor_Score,
          Committee_Score,
          Major_ID,
          Progress_ID,
          Sub_Progress_ID,
          Score_criteria_ID,
        ],
        (err, result, fields) => {
          if (err) {
            throw err;
          } else {
            res.status(200).json({ msg: "success", status: 200 });
          }
        }
      );
    } else {
      // Insert new score criteria
      const insertScoreCriteria =
        "INSERT INTO `scorecriterias`(`Advisor_Score`, `Committee_Score`, `Major_ID`, `Progress_ID`, `Sub_Progress_ID`, `Project_on_term_ID`) VALUES(?, ?, ?, ?, ?, ?)";
      con.query(
        insertScoreCriteria,
        [
          Advisor_Score,
          Committee_Score,
          Major_ID,
          Progress_ID,
          Sub_Progress_ID,
          Project_on_term_ID,
        ],
        (err, result, fields) => {
          if (err) {
            throw err;
          } else {
            res.status(200).json({ msg: "success", status: 200 });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", status: 422 });
  }
};

//* === Grade criteria === *//
// Get all grade criterias
getGradeAllMajor = async (req, res) => {
  const sql = "SELECT * FROM `gradecriterias`";
  con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// Get grade criteria by major id
getGradeByMajor = async (req, res) => {
  const majorId = req.body.Major_ID;
  // Query selecting grade criterias in a major based on latest project on term (ie. latest semester)
  const getGradeCriteriasSql =
    "SELECT * FROM `gradecriterias` WHERE Major_ID = ? AND Project_on_term_ID = (SELECT `Project_on_term_ID` FROM `projectonterm` ORDER BY projectonterm.Project_on_term_ID DESC LIMIT 1) ORDER BY Grade_Criteria_ID ASC";
  try {
    con.query(getGradeCriteriasSql, [majorId], (err, result) => {
      if (err) throw err;
      res.status(200).json(result);
      return;
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Interal Server Error");
    return;
  }
  // try {
  //   con.query(sql, [majorId], (err, result, fields) => {
  //     if (err) {
  //       throw err;
  //     } else {
  //       if (result.length === 0) {
  //         // If there are no criterias, return the default values
  //         res.status(200).json([
  //           {
  //             Grade_Criteria_Name: "S",
  //             Grade_Criteria_Pass: 0,
  //             Major_ID: majorId,
  //           },
  //           {
  //             Grade_Criteria_Name: "U",
  //             Grade_Criteria_Pass: 0,
  //             Major_ID: majorId,
  //           },
  //         ]);
  //       } else {
  //         res.status(200).json(result);
  //       }
  //     }
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ msg: "Internal Server Error", status: 500 });
  // }
};

// Add grade criterias
addGradeCriteria = async (req, res) => {
  const { data } = req.body;
  // Insert new grade criteria
  const insertGradeCriteria =
    "INSERT INTO gradecriterias(Grade_Criteria_Name, Grade_Criteria_Pass, Major_ID, Project_on_term_ID) VALUES ?";
  try {
    con.query(
      insertGradeCriteria,
      [data.map((obj) => Object.values(obj))],
      (err, result, fields) => {
        if (err) throw err;
        res.status(200).json({ msg: "success", status: 200 });
        return;
      }
    );
  } catch (err) {
    console.log(err);
    res.status(422).json({ msg: "Query Error", err });
    return;
  }
};

// Edit grade criterias
editGradeCriteria = async (req, res) => {
  const { data } = req.body;
  // Update grade criteria if "Grade_Criteria_ID" exists
  try {
    const updateGradeCriteria =
      "INSERT INTO gradecriterias(Grade_Criteria_ID, Grade_Criteria_Name, Grade_Criteria_Pass, Major_ID, Project_on_term_ID) VALUES ? ON DUPLICATE KEY UPDATE Grade_Criteria_Pass=VALUES(Grade_Criteria_Pass)";
    con.query(
      updateGradeCriteria,
      [data.map((obj) => Object.values(obj))],
      (err, result, fields) => {
        if (err) throw err;
      }
    );
    res.status(200).json({ msg: "success", status: 200 });
    return;
  } catch (err) {
    console.log(err);
    res.status(422).json({ msg: "Query Error", err });
    return;
  }
};

getProgressMaxScore = (req, res) => {
  const { Group_Role, Progress_ID, Project_on_term_ID } = req.body;
  // Convert group role number to text
  // TODO: This should fetch from the database (subroles) table ?
  const role = Group_Role === 0 ? "Advisor_Score" : "Committee_Score";

  const getMaxScoreSql = `SELECT ${role}, (SELECT Assignment_ID FROM assignments WHERE Progress_ID = ?) AS Assignment_ID FROM scorecriterias WHERE Progress_ID = ? AND  Project_on_term_ID = ?`;
  try {
    con.query(
      getMaxScoreSql,
      [Progress_ID, Progress_ID, Project_on_term_ID],
      (err, result, fields) => {
        if (err) throw err;
        // If no result res right away
        if (!result || result.length === 0) {
          res.status(500).json({ msg: "No max score found", status: 500 });
          return;
        }

        // Basically, get the first result (which will be an object) then convert it into an array of 2 results,
        // Which are score (index 0) follwed by assignment_id (index 1)
        const arr = Object.values(result[0]);
        res.status(200).json({ score: arr[0], Assignment_ID: arr[1] });
        return;
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
    return;
  }
};

getAssignmentId = (req, res) => {
  const { Progress_ID, Group_ID } = req.body;
  console.log("New assignment id: ", Progress_ID);
  const getAssignmentId =
    "SELECT Assignment_ID FROM assignments WHERE Progress_ID = ? AND Group_ID = ?";
  try {
    con.query(
      getAssignmentId,
      [Progress_ID, Group_ID],
      (err, result, fields) => {
        if (err) throw err;
        res.status(200).json(result[0].Assignment_ID);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getScoreAllMajor,
  getScoreByMajor,
  editScoreCriteria,
  getGradeAllMajor,
  getGradeByMajor,
  editGradeCriteria,
  getProgressMaxScore,
  getAssignmentId,
  addGradeCriteria,
};
