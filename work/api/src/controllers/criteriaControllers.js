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
  const majorId = req.body.Major_ID;
  let projectOnTerm;
  const sql =
    "SELECT `Score_criteria_ID`, `Advisor_Score`, `Committee1_Score`, `Committee2_Score`, `Major_ID`, (SELECT `Progress_ID` FROM `progressions` WHERE progressions.Progress_ID = scorecriterias.Progress_ID) AS `Progress_ID`, (SELECT `Progress_Name` FROM `progressions` WHERE progressions.Progress_ID = scorecriterias.Progress_ID) AS `Progress_Name`, `Sub_Progress_ID`, `Project_on_term_ID`, `Advisor_Score` + `Committee1_Score` + `Committee2_Score` AS `Total` FROM `scorecriterias` WHERE `Major_ID` = ? AND `Project_on_term_ID` = (SELECT `Project_on_term_ID` FROM `projectonterm` ORDER BY projectonterm.Project_on_term_ID DESC LIMIT 1) ORDER BY Progress_ID ASC";
  con.query(sql, [majorId], async (err, scoreCriteriasResult, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }

    // If there's no result we still need the latest project on term id
    if (scoreCriteriasResult.length === 0) {
      console.log("zero");
      const termID =
        "SELECT `Project_on_term_ID` FROM `projectonterm` ORDER BY Project_on_term_ID DESC LIMIT 1";
      // Create new promise, without this it'll not wait for the result and thus break the API
      projectOnTerm = await new Promise((resolve, reject) => {
        con.query(termID, (err, termResult, fields) => {
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
          } else {
            // Assing project on term id
            resolve(termResult[0].Project_on_term_ID);
          }
        });
      });
    }
    // This will check and fill in any missing progress
    // List of criterias needed to return
    const scoreCriteriasTemplate = [
      "Progress 1",
      "Progress 2",
      "Progress 3",
      "Progress 4",
      "Final Presentation",
      "Final Documentation"
    ];
    // Check and fill scoreCriterias with missing progress in database
    for (let i = 0; i < scoreCriteriasTemplate.length; i++) {
      const existsProgress = scoreCriteriasResult.map(itm => itm.Progress_Name);
      // Look for progress that does not exists in the score criterias, and add them
      !existsProgress.includes(scoreCriteriasTemplate[i]) &&
        scoreCriteriasResult.push({
          Advisor_Score: 0,
          Committee1_Score: 0,
          Committee2_Score: 0,
          Major_ID: majorId,
          Progress_Name: scoreCriteriasTemplate[i],
          Progress_ID: i + 1,
          Project_on_term_ID:
            projectOnTerm || scoreCriteriasResult[0].Project_on_term_ID,
          Score_criteria_ID: null,
          Sub_Progress_ID: null,
          Total: 0
        });
    }
    res.status(200).json(scoreCriteriasResult);
  });
};

// Edit score criterias
editScoreCriteria = (req, res) => {
  // console.log("Criteria Controller line 63: ", req.body);
  const {
    Score_criteria_ID,
    Advisor_Score,
    Committee1_Score,
    Committee2_Score,
    Major_ID,
    Progress_ID,
    Sub_Progress_ID,
    Project_on_term_ID
  } = req.body;
  // Update score criteria if "Score_criteria_ID" exists
  if (Score_criteria_ID) {
    const updateScoreCriteria =
      "UPDATE scorecriterias SET `Advisor_Score`=?, `Committee1_Score`=?, `Committee2_Score`=?, `Major_ID`=?, `Progress_ID`=?, `Sub_Progress_ID`=? WHERE `Score_criteria_ID` = ?";
    con.query(
      updateScoreCriteria,
      [
        Advisor_Score,
        Committee1_Score,
        Committee2_Score,
        Major_ID,
        Progress_ID,
        Sub_Progress_ID,
        Score_criteria_ID
      ],
      (err, result, fields) => {
        if (err) res.status(422).json({ msg: "Query Error", status: 422 });
        res.status(200).json({ msg: "success", status: 200 });
      }
    );
  } else {
    // Insert new score criteria
    const insertScoreCriteria =
      "INSERT INTO `scorecriterias`(`Advisor_Score`, `Committee1_Score`, `Committee2_Score`, `Major_ID`, `Progress_ID`, `Sub_Progress_ID`, `Project_on_term_ID`) VALUES(?, ?, ?, ?, ?, ?, ?)";
    con.query(
      insertScoreCriteria,
      [
        Advisor_Score,
        Committee1_Score,
        Committee2_Score,
        Major_ID,
        Progress_ID,
        Sub_Progress_ID,
        Project_on_term_ID
      ],
      (err, result, fields) => {
        if (err) res.status(422).json({ msg: err, status: 422 });
        res.status(200).json({ msg: "success", status: 200 });
      }
    );
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
  const sql =
    "SELECT * FROM `gradecriterias` WHERE Major_ID = ? AND Project_on_term_ID = (SELECT `Project_on_term_ID` FROM `projectonterm` ORDER BY projectonterm.Project_on_term_ID DESC LIMIT 1) ORDER BY Grade_Criteria_ID ASC";
  con.query(sql, [majorId], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      // Setup default values
      const gradeCriteriaArr = [
        {
          Grade_Criteria_Name: "I",
          Grade_Criteria_Pass: "-"
        },
        {
          Grade_Criteria_Name: "P",
          Grade_Criteria_Pass: "-"
        }
      ];
      if (result.length === 0) {
        // If there are no criterias, return the default values
        res.status(200).json([
          {
            Grade_Criteria_Name: "S",
            Grade_Criteria_Pass: 0,
            Major_ID: majorId
          },
          {
            Grade_Criteria_Name: "U",
            Grade_Criteria_Pass: 0,
            Major_ID: majorId
          },
          ...gradeCriteriaArr
        ]);
      } else {
        res.status(200).json([...result, ...gradeCriteriaArr]);
      }
    }
  });
};

// Edit grade criterias
editGradeCriteria = async (req, res) => {
  const { data } = req.body;
  // Update grade criteria if "Grade_Criteria_ID" exists
  if (data[0].Grade_Criteria_ID) {
    const updateGradeCriteria =
      "INSERT INTO gradecriterias(Grade_Criteria_ID, Grade_Criteria_Name, Grade_Criteria_Pass, Major_ID, Project_on_term_ID) VALUES ? ON DUPLICATE KEY UPDATE Grade_Criteria_Pass=VALUES(Grade_Criteria_Pass)";
    // "UPDATE gradecriterias SET `Grade_Criteria_Name`=?, `Grade_Criteria_Pass`=? WHERE `Grade_Criteria_ID` = ?";
    con.query(
      updateGradeCriteria,
      [data.map(obj => Object.values(obj))],
      (err, result, fields) => {
        try {
          if (err) throw err;
        } catch (err) {
          console.log(err);
          res.status(422).json({ msg: "Query Error", err });
        }
      }
    );
    res.status(200).json({ msg: "success", status: 200 });
  } else {
    // Insert new grade criteria
    // console.log("Insert (criteriaController: 216): ", data);
    const insertGradeCriteria =
      "INSERT INTO gradecriterias(Grade_Criteria_Name, Grade_Criteria_Pass, Major_ID, Project_on_term_ID) VALUES ?";
    con.query(
      insertGradeCriteria,
      [data.map(obj => Object.values(obj))],
      (err, result, fields) => {
        try {
          if (err) throw err;
        } catch (err) {
          console.log(err);
          res.status(422).json({ msg: "Query Error", err });
        }
      }
    );
    res.status(200).json({ msg: "success", status: 200 });
  }
};

module.exports = {
  getScoreAllMajor,
  getScoreByMajor,
  editScoreCriteria,
  getGradeAllMajor,
  getGradeByMajor,
  editGradeCriteria
};
