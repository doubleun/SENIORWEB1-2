const con = require("../config/db");

// Upload one file
uploadFile = async (req, res) => {
  let assignment = req.files.assignment;
  if (!assignment) res.status(404).json({ msg: "No file attached!" });

  //Use the mv() method to place the file in upload directory (i.e. "uploads")
  let name = Date.now() + "_" + assignment.name;
  assignment.mv("uploads/assignments/" + name);

  res.status(200).json({ msg: "success" });
};

// Upload assignments
uploadAssignments = async (req, res) => {
  // Get all assignments
  let assignments = req.files[""];
  if (!assignments) res.status(404).json({ msg: "No files attached!" });

  // Get other fields
  const { Progress_ID, Group_ID, Assignment_Type: Type } = req.body;

  // Mutate assignments name
  assignments = assignments.map(assignment => ({
    ...assignment,
    name: Date.now() + "_" + assignment.name
  }));

  // Database queries
  const assignment =
    "INSERT INTO assignments(Progress_ID, Group_ID) VALUES (?, ?)";
  const files =
    "INSERT INTO files(File_Name, Type, Assignment_ID) VALUES (?, ?, ?)";
  try {
    // 1.) Insert assignment
    con.query(
      assignment,
      [Progress_ID, Group_ID],
      (err, assignmentResult, fields) => {
        if (err) throw err;

        // 2.) Insert files to database and use mv on all files (ie. save files)
        assignments.forEach(assignment => {
          // Insert each file into database
          con.query(
            files,
            [assignment.name, Type, assignmentResult.insertId],
            (err, result, fields) => {
              if (err) throw err;
            }
          );
          // Save each file using 'mv'
          assignment.mv("uploads/assignments/" + assignment.name);
        });
      }
    );
  } catch (err) {
    res.status(422).json({ msg: "Query Error" });
  }

  res.status(200).json({ msg: "success" });
};

givecomment = async (req, res) => {
  const { Score, Assignment_Id, Comment, GroupmemberId } = req.body;
  const sql =
    "INSERT INTO scores(Score, Assignment_ID, Comment, Group_Member_ID) VALUES (?,?,?,?)";

  await con.query(
    sql,
    [Score, Assignment_Id, Comment, GroupmemberId],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).json("success");
      }
    }
  );
};

// update progression of group
updateProgression = async (req, res) => {
  const { Major_ID, Project_on_term_ID, Progress_ID, Group_ID } = req.body;
  const criterias =
    "SELECT * FROM `scorecriterias` WHERE Major_ID=? AND Project_on_term_ID=? AND Progress_ID=?";
  const score =
    "SELECT sc.Assignment_ID,sc.Score,sc.Comment,sc.Group_Member_ID FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE ass.Group_ID=? AND ass.Progress_ID=?";
  const update = "UPDATE groups SET Group_Progression =? WHERE Group_ID=?";
  await con.query(
    criterias,
    [Major_ID, Project_on_term_ID, Progress_ID],
    (err, result, fields) => {
      var giver = 0;
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        if (result.length == 0) {
          res.status(200).send("No Score criterias");
          return (giver = 0);
        }
        if (result[0].Advisor_Score != 0 && result[0].Advisor_Score != null) {
          giver += 1;
        }
        if (
          result[0].Committee1_Score != 0 &&
          result[0].Committee1_Score != null
        ) {
          giver += 1;
        }
        if (
          result[0].Committee2_Score != 0 &&
          result[0].Committee2_Score != null
        ) {
          giver += 1;
        }
      }

      con.query(score, [Group_ID, Progress_ID], (err, score, fields) => {
        console.log(giver);
        console.log(score);
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
        } else {
          if (score.length == 0) {
            res.status(200).send("No score");
            return;
          }
          if (giver == score.length) {
            let pg;
            if (Progress_ID == 8) {
              pg = 1;
            } else {
              pg = Progress_ID + 1;
            }
            con.query(update, [pg, Group_ID], (err, score, fields) => {
              if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
              } else {
                res.status(200).send("updated progression");
              }
            });
          } else {
            res.status(200).send("not update progression");
          }
        }
      });
    }
  );
};

// get progression of dua date by major (view assigment or teacher and co)
getAssignment = async (req, res) => {
  const {
    Group_ID,
    Progress_ID,
    Group_Member_ID,
    Project_on_term_ID
  } = req.body;
  // const Project_on_term_ID = req.params.Project_on_term_ID
  const assigment =
    "SELECT * FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Group_ID=? AND ass.Progress_ID=?";
  const score =
    "SELECT * FROM `scores` WHERE Assignment_ID=? AND Group_Member_ID=?";
  await con.query(
    assigment,
    [Project_on_term_ID, Group_ID, Progress_ID],
    (err, assigment, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        con.query(
          score,
          [assigment[0].Assignment_ID, Group_Member_ID],
          (err, score, fields) => {
            if (err) {
              console.log(err);
              res.status(500).send("Internal Server Error");
            } else {
              res.status(200).json({ assigment: assigment, score: score });
            }
          }
        );
      }
    }
  );
};

// view all assigment by progress id (admin)
getAllAssignment = async (req, res) => {
  const { Project_on_term_ID, Progress_ID } = req.body;
  // const Project_on_term_ID = req.params.Project_on_term_ID
  const sql =
    "SELECT * FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=?";
  await con.query(
    sql,
    [Project_on_term_ID, Progress_ID],
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

// view all assigment by progress id (admin)
countAssigment = async (req, res) => {
  const { Project_on_term_ID } = req.body;
  // const Project_on_term_ID = req.params.Project_on_term_ID
  const sql =
    "SELECT (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=1) AS progress1, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=2) AS progress2, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=3) AS progress3, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=4) AS progress4, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=5) AS FinalPresentation, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=6) AS FinalDocumentation, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=7) AS Topic, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=8) AS Groups";
  await con.query(
    sql,
    [
      Project_on_term_ID,
      Project_on_term_ID,
      Project_on_term_ID,
      Project_on_term_ID,
      Project_on_term_ID,
      Project_on_term_ID,
      Project_on_term_ID,
      Project_on_term_ID
    ],
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

module.exports = { uploadAssignments };
