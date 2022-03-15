const con = require("../config/db");
const promisePool = con.promise();
const fs = require("fs");
const { result } = require("lodash");
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
// TODO: Implement transaction
uploadAssignments = async (req, res) => {
  let {
    Progress_ID,
    Group_ID,
    links,
    Group_Member_ID,
    abstractIndex,
    Project_on_term_ID,
  } = req.body;
  // If no link then assign empty array
  if (!links) links = [];
  // If there's only one link put it in an array
  if (typeof links === "string") links = [links];

  console.log("Abstract index: ", abstractIndex);

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
          (prev, current, index) => [
            ...prev,
            [
              current.filename,
              current.path,
              index === parseInt(abstractIndex) ? "Abstract" : "File",
              assignmentResult.insertId,
              Group_Member_ID,
            ],
          ],
          []
        );

        // If there's abstract, then take it out of the files array
        // And make another insert query to abstract table
        if (!!abstractIndex && !!Project_on_term_ID && allFiles.length > 0) {
          // get the file using abstract index
          const abstractFile = allFiles[abstractIndex];
          // // remove file from allFiles (because we will insert abstract in another table)
          // allFiles.splice(abstractIndex, 1);

          // how abstract file name is saved is a bit wierd, just take a look at the console
          console.log("Abstract File: ", abstractFile);

          // 2.1) Query to insert abstract file into database
          const abstractSql =
            "INSERT INTO `abstracts`(`Abstract_Name`, `Group_ID`, `Project_on_term_ID`) VALUES (?, ?, ?)";
          con.query(
            abstractSql,
            [abstractFile[0], Group_ID, Project_on_term_ID],
            (err) => {
              if (err) throw err;
            }
          );
        }

        // Combine links and files array, before insert into the database
        const combinedFiles = [...links, ...allFiles];

        // 2.2) Insert all files into database
        con.query(filesSql, [combinedFiles], (err, filesResult, fields) => {
          if (err) throw err;
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(422).json({ msg: "Query Error", staus: 422 });
    return;
  }

  res.status(200).json({ msg: "success", status: 200 });
  return;
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
  console.log(
    Score,
    Max_Score,
    Comment,
    Group_Member_ID,
    Assignment_ID,
    Group_ID
  );
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
      (err) => {
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
        (err) => {
          if (err) throw err;
        }
      );
    }

    // Commit transaction
    await promisePool.commit();
    // console.log("res check assigment", result);

    // 3.) Update group progression to the next one
    // Query will count number or scores given based on the assignemnt ID if it's 3, then the group progression will go up to the next available progress
    // TODO: Add group id as condition in subquery
    const groupProgressSql =
      "UPDATE `groups` SET `Group_Progression` = IF((SELECT COUNT(`Score_ID`) FROM `scores` WHERE `Assignment_ID` = ?) = 3, ?, `Group_Progression`) WHERE `Group_ID` = ?";
    // const groupProgressSql =
    //   "UPDATE `groups` SET `Group_Progression` = CASE WHEN (SELECT COUNT(`Score_ID`) FROM `scores` WHERE `Assignment_ID` = ?)=2 THEN ? ELSE Group_Progression END WHERE `Group_ID` = ?";
    con.query(
      groupProgressSql,
      [Assignment_ID, Next_Progress_ID, Group_ID],
      (err) => {
        if (err) throw err;
      }
    );
    res.status(200).json({ msg: "success", status: 200 });
    return;
  } catch (err) {
    console.log(`Error occurred while creating order: ${err.message}`, err);
    promisePool.rollback();
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
    "SELECT sc.Score, sc.Comment, f.File_Name, f.Type FROM `scores` sc LEFT JOIN `files` f ON sc.Group_Member_ID = f.Group_Member_ID AND sc.Assignment_ID = f.Assignment_ID WHERE sc.Group_Member_ID = ? AND sc.Assignment_ID = ?";
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
countAssigment = (req, res) => {
  const { Project_on_term_ID } = req.body;
  // const Project_on_term_ID = req.params.Project_on_term_ID
  const sql =
    "SELECT (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=1) AS progress1, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=2) AS progress2, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=3) AS progress3, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=4) AS progress4, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=5) AS FinalPresentation, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=6) AS FinalDocumentation, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=7) AS Topic, (SELECT COUNT(*) FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE gp.Project_on_term_ID=? AND ass.Progress_ID=8) AS Groups";
  con.query(
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
      "SELECT SUM(sc.Score) AS `score`, (SELECT `Progress_Name` FROM `progressions` p WHERE p.Progress_ID = assign.Progress_ID) AS `name` FROM `scores` sc INNER JOIN `assignments` assign ON sc.Assignment_ID = assign.Assignment_ID WHERE assign.Group_ID = ?  GROUP BY assign.Progress_ID;";

    con.query(getEvalScoresSql, [Group_ID], (err, result) => {
      if (err) throw err;

      // Construct objct of evaluation scores
      // 'result' has 2 properties: name and score
      const finalRes = result.reduce(
        (prev, current) => ({
          ...prev,
          // 1.) Convert each progress name into camelCase, becuase on the front-end they use camelCase in data-table
          [current.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())]:
            // 2.) Assign score to each progress name
            current.score,
        }),
        {}
      );

      res.status(200).json(finalRes);
      return;
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
    return;
  }
};

getAbstracts = (req, res) => {
  const abstracts =
    "SELECT subquery.Abstract_ID, subquery.Abstract_Name,subquery.Submit_Date,subquery.Group_ID,subquery.Major, subquery.Project_on_term_ID,subquery.Group_Name_Thai,subquery.Group_Name_Eng,(SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=0 ) AS Advisor,(SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND ( gmb.Group_Role=2 OR gmb.Group_Role=3) ) AS Students FROM (SELECT abs.Abstract_ID,abs.Abstract_Name,abs.Submit_Date,abs.Group_ID, abs.Project_on_term_ID,gp.Group_Name_Thai,gp.Group_Name_Eng,gmb.Group_Member_ID,gmb.User_Email, gmb.Group_Role,gp.Major FROM abstracts abs INNER JOIN groups gp ON abs.Group_ID=gp.Group_ID INNER JOIN groupmembers gmb  ON gp.Group_ID=gmb.Group_ID  WHERE gmb.User_Status=1 AND gmb.Group_Role!=1) AS subquery GROUP BY subquery.Group_ID";
  con.query(abstracts, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// for check studnet can't update group info after submit an assignment
getGroupAssignment = (req, res) => {
  console.log(req.body);
  const Group_ID = req.body.Group_ID;
  const groupAssignment = "SELECT * FROM `assignments` WHERE Group_ID = ?";
  con.query(groupAssignment, [Group_ID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      console.l;
      res.status(200).json(result);
    }
  });
};

module.exports = {
  uploadAssignments,
  giveProgressScore,
  getTeacherProgressScore,
  getAssignmentFiles,
  getAssignment,
  countFileByMajor,
  getEvaluationScores,
  getAbstracts,
  getGroupAssignment,
};
