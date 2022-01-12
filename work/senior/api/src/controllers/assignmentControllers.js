const con = require("../config/db");
const promisePool = con.promise();
const fs = require("fs");
// // Upload one file
// uploadFile = async (req, res) => {
//   let assignment = req.files.assignment;
//   if (!assignment) res.status(404).json({ msg: "No file attached!" });

//   //Use the mv() method to place the file in upload directory (i.e. "uploads")
//   let name = Date.now() + "_" + assignment.name;
//   assignment.mv("uploads/assignments/" + name);

//   res.status(200).json({ msg: "success" });
// };

// Upload assignments
uploadAssignments = async (req, res) => {
  let { Progress_ID, Group_ID, links, Group_Member_ID } = req.body;
  // // If no link then assign empty array
  if (!links) links = [];
  // If there's only one link put it in an array
  if (typeof links === "string") links = [links];

  // Database queries
  const assignmentSql =
    "INSERT INTO assignments(Progress_ID, Group_ID) VALUES (?, ?)";
  const filesSql =
    "INSERT INTO files(File_Name, Path, Type, Assignment_ID, Group_Member_ID) VALUES ?";
  try {
    // 1.) Insert assignment
    con.query(
      assignmentSql,
      [Progress_ID, Group_ID],
      (err, assignmentResult, fields) => {
        if (err) throw err;

        // 2.) Insert files into database
        // Add path, type, and assignment id to both links and files
        // Group_Role will be 2 for students
        links = links.reduce(
          (prev, current) => [
            ...prev,
            [
              current,
              current,
              "Link",
              assignmentResult.insertId,
              Group_Member_ID,
            ],
          ],
          []
        );
        const allFiles = req.files.reduce(
          (prev, current) => [
            ...prev,
            [
              current.filename,
              current.path,
              "File",
              assignmentResult.insertId,
              Group_Member_ID,
            ],
          ],
          []
        );
        // Combine links and files array, before insert into the database
        const combinedFiles = [...links, ...allFiles];

        // Insert into database
        con.query(filesSql, [combinedFiles], (err, filesResult, fields) => {
          if (err) throw err;
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(422).json({ msg: "Query Error", staus: 422 });
  }

  res.status(200).json({ msg: "success", status: 200 });
};

// Get assignment files
getAssignmentFiles = (req, res) => {
  const { Group_ID, Progress_ID } = req.body;
  // console.log(Group_ID, Progress_ID);
  try {
    const sql =
      "SELECT `File_Name`, `Type`, `Group_Member_ID`, (SELECT `Submit_Date` FROM `assignments` WHERE `Assignment_ID` = files.Assignment_ID) AS `Submit_Date`, (SELECT `Group_Role` FROM `groupmembers` WHERE `Group_Member_ID` = files.Group_Member_ID) AS `Group_Role` FROM `files` WHERE `Assignment_ID` = (SELECT `Assignment_ID` FROM `assignments` WHERE `Group_ID` = ? AND `Progress_ID` = ? ORDER BY `Submit_Date` DESC LIMIT 1)";
    con.query(sql, [Group_ID, Progress_ID], (err, result, fields) => {
      res.status(200).json(result);
    });
  } catch (err) {
    res.status(422).json({ msg: "Query Error", staus: 422 });
  }
};



// givecomment = async (req, res) => {
//   const { Score, Assignment_Id, Comment, GroupmemberId } = req.body;
//   const sql =
//     "INSERT INTO scores(Score, Assignment_ID, Comment, Group_Member_ID) VALUES (?,?,?,?)";

//   await con.query(
//     sql,
//     [Score, Assignment_Id, Comment, GroupmemberId],
//     (err, result, fields) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send("Internal Server Error");
//       } else {
//         res.status(200).json("success");
//       }
//     }
//   );
// };

giveProgressScore = async (req, res) => {
  const {
    Score,
    Max_Score,
    Comment,
    Group_Member_ID,
    Group_ID,
    Assignment_ID,
    Next_Progress_ID,
  } = req.body;
  console.log(Score, Max_Score, Comment, Group_Member_ID, Assignment_ID);
  console.log("File: ", req.file);
  console.log("Next_Progress_ID: ", Next_Progress_ID);
  try {
    // Create new transaction
    promisePool.beginTransaction((err) => {
      if (err) throw err;
    });
    // 1.) Insert score
    const insertScore =
      "INSERT INTO `scores`(`Score`, Max_Score, `Comment`, `Group_Member_ID`, `Assignment_ID`) VALUES (?,?,?,?, ?)";
    // TODO: check affected rows
    await promisePool.execute(
      insertScore,
      [Score, Max_Score, Comment, Group_Member_ID, Assignment_ID],
      (err, result) => {
        if (err) throw err;
      }
    );

    // If there is a file, insert into the database
    if (!!req.file) {
      // 2.) Insert files into database
      const filesSql =
        "INSERT INTO files(File_Name, Path, Type, Assignment_ID, Group_Member_ID) VALUES (?, ?, ?, ?, ?)";
      await promisePool.execute(
        filesSql,
        [
          req.file.filename,
          req.file.path,
          "File",
          Assignment_ID,
          Group_Member_ID,
        ],
        (err, result) => {
          if (err) throw err;
        }
      );
    }

    // 3.) Update group progression to the next one
    // Query will count number or scores given based on the assignemnt ID if it's 3, then the group progression will go up to the next available progress
    const groupProgressSql =
      "UPDATE `groups` SET `Group_Progression` = IF((SELECT COUNT(`Score_ID`) FROM `scores` WHERE `Assignment_ID` = ?) = 3, ?, `Group_Progression`) WHERE `Group_ID` = ?";
    await promisePool.execute(
      groupProgressSql,
      [Assignment_ID, Next_Progress_ID, Group_ID],
      (err, result) => {
        if (err) throw err;
      }
    );
    // Commit transaction
    await promisePool.commit();
    res.status(200).json({ msg: "success", status: 200 });
    return;
  } catch (err) {
    console.log(`Error occurred while creating order: ${err.message}`, err);
    connection.rollback();
    console.log("Rollback successfully");
    res.status(500).send("Internal Server Error");
    return;
  }
};

//! OLD
// giveProgressScore = (req, res) => {
//   const {
//     Score,
//     Max_Score,
//     Comment,
//     Group_Member_ID,
//     Group_ID,
//     Assignment_ID,
//     Next_Progress_ID,
//   } = req.body;
//   console.log(Score, Max_Score, Comment, Group_Member_ID, Assignment_ID);
//   console.log("File: ", req.file);
//   console.log("Next_Progress_ID: ", Next_Progress_ID);
//   const insertScore =
//     "INSERT INTO `scores`(`Score`, Max_Score, `Comment`, `Group_Member_ID`, `Assignment_ID`) VALUES (?,?,?,?, ?)";
//   try {
//     // 1.) Insert score
//     con.query(
//       insertScore,
//       [Score, Max_Score, Comment, Group_Member_ID, Assignment_ID],
//       (err, result, fields) => {
//         if (err) throw err;
//         // Insert files
//         const filesSql =
//           "INSERT INTO files(File_Name, Path, Type, Assignment_ID, Group_Member_ID) VALUES (?, ?, ?, ?, ?)";

//         // 2.) Insert files into database
//         con.query(
//           filesSql,
//           [
//             req.file.filename,
//             req.file.path,
//             "File",
//             Assignment_ID,
//             Group_Member_ID,
//           ],
//           (err, filesResult, fields) => {
//             if (err) {
//               throw err;
//             } else {
//               // If next group progression id is not 'null' update the current group progression to the next one
//               if (!!Next_Progress_ID) {
//                 // 3.) Update group progression to the next one
//                 // Query will count number or scores given based on the assignemnt ID if it's 3
//                 // Then the group progression will go up to the next available progress
//                 const groupProgressSql =
//                   "UPDATE `groups` SET `Group_Progression` = IF((SELECT COUNT(`Score_ID`) FROM `scores` WHERE `Assignment_ID` = ?) = 3, ?, `Group_Progression`) WHERE `Group_ID` = ?";
//                 con.query(
//                   groupProgressSql,
//                   [Assignment_ID, Next_Progress_ID, Group_ID],
//                   (err, result, fields) => {
//                     if (err) {
//                       throw err;
//                     } else {
//                       res.status(200).json({ msg: "success", status: 200 });
//                       return;
//                     }
//                   }
//                 );
//               }
//             }
//           }
//         );
//       }
//     );
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//   }
// };

// For teacher progress page, since it fetch only current teacher's score information
getTeacherProgressScore = (req, res) => {
  const { Group_Member_ID, Assignment_ID } = req.body;
  console.log(Group_Member_ID, Assignment_ID);
  const sql =
    "SELECT sc.Score, sc.Comment, f.File_Name, f.Type FROM `scores` sc INNER JOIN `files` f ON sc.Group_Member_ID = f.Group_Member_ID WHERE sc.Group_Member_ID = ? AND sc.Assignment_ID = ?";
  try {
    con.query(sql, [Group_Member_ID, Assignment_ID], (err, result, fields) => {
      if (err) throw err;
      res.status(200).json(result[0]);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
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
// * if student don't send Group_Member_ID to api
getAssignment = async (req, res) => {
  console.log(req.body);
  const { Group_ID, Progress_ID, Group_Member_ID, Project_on_term_ID } =
    req.body;
  // const Project_on_term_ID = req.params.Project_on_term_ID
  // const assigment =
  //   "SELECT * FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Group_ID=? AND ass.Progress_ID=?";
  const assigment =
    "SELECT * FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Group_ID=? AND ass.Progress_ID=? AND fl.Score_ID IS NULL";
  const comments =
    Group_Member_ID != null
      ? "SELECT sc.Score_ID, sc.Comment,fl.File_Name,gmb.Group_Role,gmb.Group_Member_ID FROM scores sc INNER JOIN files fl ON sc.Score_ID=fl.Score_ID INNER JOIN groupmembers gmb ON sc.Group_Member_ID = gmb.Group_Member_ID WHERE fl.Assignment_ID=? AND sc.Group_Member_ID=?"
      : "SELECT sc.Score_ID, sc.Comment,fl.File_Name,gmb.Group_Role,gmb.Group_Member_ID FROM scores sc INNER JOIN files fl ON sc.Score_ID=fl.Score_ID INNER JOIN groupmembers gmb ON sc.Group_Member_ID = gmb.Group_Member_ID WHERE fl.Assignment_ID=?";

  await con.query(
    assigment,
    [Project_on_term_ID, Group_ID, Progress_ID],
    (err, assigment, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        // console.log(assigment)
        if (assigment.length == 0) {
          res.status(200).send("No Assignment");
        } else {
          con.query(
            comments,
            [assigment[0].Assignment_ID, Group_Member_ID],
            (err, comments, fields) => {
              if (err) {
                console.log(err);
                res.status(500).send("Internal Server Error");
              } else {
                if (comments.length == 0) {
                  res.status(200).send("No Comments From Teacher");
                } else {
                  res
                    .status(200)
                    .json({ assigment: assigment, comments: comments });
                }
              }
            }
          );
        }
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
      Project_on_term_ID,
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

// count last progress file for coordinator
countFileByMajor = async (req, res) => {
  const { Project_on_term_ID, Major, Progress_ID } = req.body;
  console.log(req.body);
  const sql =
    "SELECT COUNT(*) AS TotalFile FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND gp.Major=? AND ass.Progress_ID=?";
  con.query(
    sql,
    [Project_on_term_ID, Major, Progress_ID],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(result);
        res.status(200).json(result);
      }
    }
  );
};

getEvaluationScores = (req, res) => {
  const { Group_ID } = req.body;
  try {
    const getEvalScoresSql =
      "SELECT (SELECT SUM(sc.Score) FROM `scores` sc WHERE sc.Assignment_ID = assign.Assignment_ID AND assign.Progress_ID = 3) AS `progress1`, (SELECT SUM(sc.Score) FROM `scores` sc WHERE sc.Assignment_ID = assign.Assignment_ID AND assign.Progress_ID = 4) AS `progress2`, (SELECT SUM(sc.Score) FROM `scores` sc WHERE sc.Assignment_ID = assign.Assignment_ID AND assign.Progress_ID = 5) AS `progress3`, (SELECT SUM(sc.Score) FROM `scores` sc WHERE sc.Assignment_ID = assign.Assignment_ID AND assign.Progress_ID = 6) AS `progress4`, (SELECT SUM(sc.Score) FROM `scores` sc WHERE sc.Assignment_ID = assign.Assignment_ID AND assign.Progress_ID = 7) AS `finalPresentation`, (SELECT SUM(sc.Score) FROM `scores` sc WHERE sc.Assignment_ID = assign.Assignment_ID AND assign.Progress_ID = 8) AS `finalDocument` FROM `scores` sc INNER JOIN `assignments` assign ON sc.Assignment_ID = assign.Assignment_ID WHERE assign.Group_ID = ?";

    con.query(getEvalScoresSql, [Group_ID], (err, result) => {
      if (err) throw err;
      res.status(200).json(result[0]);
      return;
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
    return;
  }
};

module.exports = {
  uploadAssignments,
  giveProgressScore,
  getTeacherProgressScore,
  getAssignmentFiles,
  getAssignment,
  countFileByMajor,
  getEvaluationScores,
  
};
