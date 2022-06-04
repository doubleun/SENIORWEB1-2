const { json } = require("express");
const con = require("../config/db");
const { formatDateIso } = require("../utility");

//* === Score criteria === *//
// Get all score criterias
getScoreAllMajor = (req, res) => {
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

// FIXME: some font end need to send project on term id
// SQL injection ?
getScoreByMajor = (req, res) => {
  // If only available is true, then only progress with total of more than 0 will be return
  // const { Major_ID, Project_on_term_ID, onlyAvailable } = req.body;
  const {
    Major_ID,
    onlyAvailable,
    Academic_Year,
    Academic_Term,
    Senior = 1,
  } = req.body;
  let Project_on_term_ID, projectOnTermString;

  // If there are academic year pass in from body, don't use project on term id in query
  if (!!Academic_Year && !!Academic_Term) {
    Project_on_term_ID = null;
    projectOnTermString =
      "Project_on_term_ID = (SELECT `Project_on_term_ID` FROM `projectonterm` WHERE `Academic_Year` = ? AND `Academic_Term` = ? AND `Senior` = ?)";
  } else {
    Project_on_term_ID = req.user.projectOnTerm;
    projectOnTermString = "Project_on_term_ID = ?";
  }

  // const { Major_ID, onlyAvailable } = req.body;
  // Send query to fetch score criterias available in scorecriteria table, based on latest project_on_term_id
  const getScoreQuery = `SELECT Score_criteria_ID, Advisor_Score, Committee_Score, DueDate_Start, DueDate_End, Major_ID, (SELECT Progress_ID FROM progressions WHERE progressions.Progress_ID = scorecriterias.Progress_ID) AS Progress_ID, (SELECT Progress_Name FROM progressions WHERE progressions.Progress_ID = scorecriterias.Progress_ID) AS Progress_Name, Project_on_term_ID, Advisor_Score + Committee_Score AS Total, Status FROM scorecriterias WHERE Major_ID = ? AND ${projectOnTermString} ${
    !!onlyAvailable ? "AND Status = 1" : ""
  } ORDER BY Progress_ID ASC`;
  try {
    con.query(
      getScoreQuery,
      [
        Major_ID,
        ...(!!Project_on_term_ID
          ? [Project_on_term_ID]
          : [Academic_Year, Academic_Term, Senior]),
      ],
      (err, scoreCriteriasResult, fields) => {
        if (err) throw err;

        // Offset score criterias date
        if (scoreCriteriasResult.length > 0) {
          scoreCriteriasResult.forEach((score) => {
            score.DueDate_Start = formatDateIso(score.DueDate_Start);
            score.DueDate_End = formatDateIso(score.DueDate_End);
          });
        }
        console.log("scoreCriteriasResult: ", scoreCriteriasResult);

        // If only request for progress that has total of more than 0, then we don't need to fill missing progress with template
        if (onlyAvailable) {
          res.status(200).json(scoreCriteriasResult);
          return;
        } else {
          // This will check and fill in any missing progress
          // List of criterias needed to return
          /**
           * @todo template should be coming from 'constants' file or something...
           */
          const scoreCriteriasTemplate = [
            "Proposal",
            "Progress 1",
            "Progress 2",
            "Progress 3",
            "Progress 4",
            "Final Presentation",
            "Final Documentation",
          ];

          // Create new date from today
          const defaultDate = formatDateIso(Date.now());

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
                DueDate_Start: defaultDate,
                DueDate_End: defaultDate,
                Major_ID,
                Progress_Name: scoreCriteriasTemplate[i],
                Progress_ID: i + 2,
                Project_on_term_ID,
                Score_criteria_ID: null,
                Total: 0,
                Status: 0,
              });
          }
          res.status(200).json(scoreCriteriasResult);
          return;
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
    DueDate_Start,
    DueDate_End,
    Major_ID,
    Progress_ID,
    Project_on_term_ID,
  } = req.body;

  const dataPayload = [
    Advisor_Score,
    Committee_Score,
    DueDate_Start,
    DueDate_End,
    Major_ID,
    Progress_ID,
  ];

  try {
    // Update score criteria if "Score_criteria_ID" exists
    if (!!Score_criteria_ID) {
      const updateScoreCriteria =
        "UPDATE scorecriterias SET `Advisor_Score`=?, `Committee_Score`=?, `DueDate_Start` = ?, `DueDate_End` = ?, `Major_ID`=?, `Progress_ID`=? WHERE `Score_criteria_ID` = ?";
      con.query(
        updateScoreCriteria,
        [...dataPayload, Score_criteria_ID],
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
        "INSERT INTO `scorecriterias`(`Advisor_Score`, `Committee_Score`,`DueDate_Start`, `DueDate_End`, `Major_ID`, `Progress_ID`, `Project_on_term_ID`, `Status`) VALUES(?, ?, ?, ?, ?, ?, ?, 1)";
      con.query(
        insertScoreCriteria,
        [...dataPayload, Project_on_term_ID],
        (err, result, fields) => {
          if (err) {
            throw err;
          } else {
            res.status(200).json({ msg: "success", status: 200 });
            return;
          }
        }
      );
    }
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", status: 422 });
    return;
  }
};

// Edit toggle score criteria status
toggleScoreCriteriaStatus = (req, res) => {
  const { Score_criteria_ID, Status, Project_on_term_ID } = req.body;
  // const { Score_criteria_ID, Status } = req.body;

  try {
    const toggleScoreCriteria =
      "UPDATE scorecriterias SET `Status`=? WHERE `Score_criteria_ID` = ? AND `Project_on_term_ID` = ?";
    con.query(
      toggleScoreCriteria,
      [Status, Score_criteria_ID, Project_on_term_ID],
      (err, result, fields) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json({ msg: "success", status: 200 });
          return;
        }
      }
    );
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", status: 422 });
    return;
  }
};
// // Edit score criterias
// editScoreCriteria = (req, res) => {
//   const {
//     Score_criteria_ID,
//     Advisor_Score,
//     Committee_Score,
//     Major_ID,
//     Progress_ID,
//     Project_on_term_ID,
//   } = req.body;
//   try {
//     // Update score criteria if "Score_criteria_ID" exists
//     if (Score_criteria_ID) {
//       const updateScoreCriteria =
//         "UPDATE scorecriterias SET `Advisor_Score`=?, `Committee_Score`=?, `Major_ID`=?, `Progress_ID`=? WHERE `Score_criteria_ID` = ?";
//       con.query(
//         updateScoreCriteria,
//         [
//           Advisor_Score,
//           Committee_Score,
//           Major_ID,
//           Progress_ID,
//           Score_criteria_ID,
//         ],
//         (err, result, fields) => {
//           if (err) {
//             throw err;
//           } else {
//             res.status(200).json({ msg: "success", status: 200 });
//           }
//         }
//       );
//     } else {
//       // Insert new score criteria
//       const insertScoreCriteria =
//         "INSERT INTO `scorecriterias`(`Advisor_Score`, `Committee_Score`, `Major_ID`, `Progress_ID`, `Project_on_term_ID`) VALUES(?, ?, ?, ?, ?)";
//       con.query(
//         insertScoreCriteria,
//         [
//           Advisor_Score,
//           Committee_Score,
//           Major_ID,
//           Progress_ID,
//           Project_on_term_ID,
//         ],
//         (err, result, fields) => {
//           if (err) {
//             throw err;
//           } else {
//             res.status(200).json({ msg: "success", status: 200 });
//           }
//         }
//       );
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Internal Server Error", status: 422 });
//   }
// };

//* === Grade criteria === *//
// Get all grade criterias
getGradeAllMajor = (req, res) => {
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
getGradeByMajor = (req, res) => {
  const { Major_ID, Academic_Term, Academic_Year, Senior = 1 } = req.body;
  let Project_on_term_ID, projectOnTermString;
  // If there are academic year pass in from body, don't use project on term id in query
  if (!!Academic_Year && !!Academic_Term) {
    Project_on_term_ID = null;
    projectOnTermString =
      "Project_on_term_ID = (SELECT `Project_on_term_ID` FROM `projectonterm` WHERE `Academic_Year` = ? AND `Academic_Term` = ? AND `Senior` = ?)";
  } else {
    Project_on_term_ID = req.user.projectOnTerm;
    projectOnTermString = "Project_on_term_ID = ?";
  }
  // Query selecting grade criterias in a major based on latest project on term (ie. latest semester)

  // I had change from laster project on term to user project on term id
  const getGradeCriteriasSql = `SELECT * FROM gradecriterias WHERE Major_ID = ? AND ${projectOnTermString}`;
  try {
    con.query(
      getGradeCriteriasSql,
      [
        Major_ID,
        ...(!!Project_on_term_ID
          ? [Project_on_term_ID]
          : [Academic_Year, Academic_Term, Senior]),
      ],
      (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
        return;
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Interal Server Error");
    return;
  }
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
  // const { Group_Role, Group_ID, Progress_ID, Project_on_term_ID } = req.body;
  const { Group_Role, Group_ID, Progress_ID } = req.body;
  // Convert group role number to text
  // TODO: This should fetch from the database (subroles) table ?
  const role = Group_Role === 0 ? "Advisor_Score" : "Committee_Score";

  const getMaxScoreSql = `SELECT ${role}, (SELECT Assignment_ID FROM assignments WHERE Progress_ID = ? AND Group_ID = ?) AS Assignment_ID FROM scorecriterias WHERE Progress_ID = ? AND  Project_on_term_ID = ?`;
  try {
    con.query(
      getMaxScoreSql,
      [Progress_ID, Group_ID, Progress_ID, req.user.projectOnTerm],
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
  toggleScoreCriteriaStatus,
  getGradeAllMajor,
  getGradeByMajor,
  editGradeCriteria,
  getProgressMaxScore,
  getAssignmentId,
  addGradeCriteria,
};
