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

// Get score criteria by major id
getScoreByMajor = async (req, res) => {
  const majorId = req.body.Major_ID;
  const sql = "SELECT * FROM `scorecriterias` WHERE Major_ID = ?";
  con.query(sql, [majorId], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

<<<<<<< Updated upstream
// Add new score criterias
// post = async (req, res) => {
//   const majorId = req.body.Major_ID;
//   const progressId = req.body.Progress_ID;
//   const sql = "INSERT INTO scorecriterias()";
//   await con.query(sql, (err, result, fields) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Internal Server Error");
//     } else {
//       res.status(200).json(result);
//     }
//   });
// };

module.exports = { getAllMajor, getByMajor };
=======
// Edit score criterias
editScoreCriteria = async (req, res) => {
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
        try {
          if (err) throw err;
        } catch (err) {
          res.status(422).json({ msg: "Query Error" });
        }
      }
    );
    res.status(200).json({ msg: "success" });
  } else {
    // Insert new score criteria
    const insertScoreCriteria =
      "INSERT INTO scorecriterias(Advisor_Score, Committee1_Score, Committee2_Score, Major_ID, Progress_ID, Sub_Progress_ID, Project_on_term_ID) VALUES(?, ?, ?, ?, ?, ?, ?)";
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
  const sql = "SELECT * FROM `gradecriterias` WHERE Major_ID = ?";
  con.query(sql, [majorId], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// Edit grade criterias
editGradeCriteria = async (req, res) => {
  const {
    Grade_Criteria_ID,
    Grade_Criteria_Name,
    Grade_Criteria_Pass,
    Major_ID,
    Project_on_term_ID
  } = req.body;
  // Update grade criteria if "Grade_Criteria_ID" exists
  if (Grade_Criteria_ID) {
    const updateGradeCriteria =
      "UPDATE gradecriterias SET `Grade_Criteria_Name`=?, `Grade_Criteria_Pass`=?, `Major_ID`=? WHERE `Grade_Criteria_ID` = ?";
    con.query(
      updateGradeCriteria,
      [Grade_Criteria_Name, Grade_Criteria_Pass, Major_ID, Grade_Criteria_ID],
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
    // Insert new grade criteria
    const insertGradeCriteria =
      "INSERT INTO gradecriterias(Grade_Criteria_Name, Grade_Criteria_Pass, Major_ID, Project_on_term_ID) VALUES(?, ?, ?, ?)";
    con.query(
      insertGradeCriteria,
      [Grade_Criteria_Name, Grade_Criteria_Pass, Major_ID, Project_on_term_ID],
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

module.exports = {
  getScoreAllMajor,
  getScoreByMajor,
  editScoreCriteria,
  getGradeAllMajor,
  getGradeByMajor,
  editGradeCriteria
};
>>>>>>> Stashed changes
