const { result } = require("lodash");
const con = require("../config/db");
const conPromise = con.promise();

createGroup = (req, res) => {
  const {
    Project_NameTh,
    Project_NameEn,
    Studen_Number,
    Advisor_Email,
    CoAdvisor_Name,
    Committee1_Email,
    Committee2_Email,
    Student1_Tel,
    Student2_Tel,
    Student3_Tel,
    Student4_Tel,
    Student5_Tel,
    Student6_Tel,
    Student7_Tel,
    Student8_Tel,
    Student9_Tel,
    Student10_Tel,
    Email_Student1,
    Major,
    email,
    Email_Student2,
    Email_Student3,
    Email_Student4,
    Email_Student5,
    Email_Student6,
    Email_Student7,
    Email_Student8,
    Email_Student9,
    Email_Student10,
    Project_on_term_ID,
  } = req.body;
  console.log(req.body);
  const sql =
    "INSERT INTO groups (Group_Name_Thai,Group_Name_Eng,Co_Advisor,Major,Project_on_term_ID) VALUES (?,?,?,?,?);";
  const sql2 =
    "INSERT INTO `groupmembers`( `User_Email`, `User_Phone`, `Group_Role`,Project_on_term_ID,User_Status, `Group_ID`) VALUES (?,(SELECT MAX(`Group_ID`) FROM `groups` WHERE`Group_Name_Eng` = ? AND`Project_on_term_ID` = ?))";
  let user = [];
  let group = [];
  let error = 0;
  let success = 0;
  user.push([Email_Student1, Student1_Tel, 3, Project_on_term_ID, 1]);

  if (Studen_Number > 1) {
    user.push([Email_Student2, Student2_Tel, 2, Project_on_term_ID, 0]);
  }
  if (Studen_Number > 2) {
    user.push([Email_Student3, Student3_Tel, 2, Project_on_term_ID, 0]);
  }
  if (Studen_Number > 3) {
    user.push([Email_Student4, Student4_Tel, 2, Project_on_term_ID, 0]);
  }
  if (Studen_Number > 4) {
    user.push([Email_Student5, Student5_Tel, 2, Project_on_term_ID, 0]);
  }
  if (Studen_Number > 5) {
    user.push([Email_Student6, Student6_Tel, 2, Project_on_term_ID, 0]);
  }
  if (Studen_Number > 6) {
    user.push([Email_Student7, Student7_Tel, 2, Project_on_term_ID, 0]);
  }
  if (Studen_Number > 7) {
    user.push([Email_Student8, Student8_Tel, 2, Project_on_term_ID, 0]);
  }
  if (Studen_Number > 8) {
    user.push([Email_Student9, Student9_Tel, 2, Project_on_term_ID, 0]);
  }
  if (Studen_Number > 9) {
    user.push([Email_Student10, Student10_Tel, 2, Project_on_term_ID, 0]);
  }
  user.push([Advisor_Email, "", 0, Project_on_term_ID, 0]);
  user.push([Committee1_Email, "", 1, Project_on_term_ID, 0]);
  user.push([Committee2_Email, "", 1, Project_on_term_ID, 0]);
  if (CoAdvisor_Name == "" || CoAdvisor_Name == null) {
    group.push([Project_NameTh, Project_NameEn, "", Major, Project_on_term_ID]);
  } else {
    group.push([
      Project_NameTh,
      Project_NameEn,
      CoAdvisor_Name,
      Major,
      Project_on_term_ID,
    ]);
  }

  con.query(sql, group[0], (err, result, fields) => {
    if (err) {
      console.log("error code first is " + err.code);
      error++;
    } else {
      for (let i = 0; i < user.length; i++) {
        con.query(
          sql2,
          [user[i], Project_NameEn, Project_on_term_ID],
          (err, result2, fields) => {
            console.log("user", user[i]);
            if (err) {
              // console.log("err hear")
              console.log(error);
              res.status(500).send("Internal Server Error");
              return;
            } else {
              // console.log("hear")
              // console.log(success + " com " + user.length);
              success++;
              console.log(result2.affectedRows);
              if (success == user.length) {
                res.status(200).send("Success");
                return;
              }
            }
          }
        );
      }
    }
  });

  // if (sucess == user.length) {
  //   res.status(200).json({ msg: "Create group Successed", status: 200 });
  // } else {
  // }
  console.log("suss", success);
  console.log("user.length", user.length);
  // if (success == user.length) {
  //   console.log("successed");
  // }
  // if (error > 0) {
  //   res.status(500).json({ msg: "Internal Server Error", status: 500 });
  // }
};

updateGroup = (req, res) => {
  const {
    Project_NameTh,
    Project_NameEn,
    Studen_Number,
    Advisor_Email,
    Group_ID,
    CoAdvisor_Name,
    Committee1_Email,
    Committee2_Email,
    Student1_Tel,
    Student2_Tel,
    Student3_Tel,
    Student4_Tel,
    Student5_Tel,
    Student6_Tel,
    Student7_Tel,
    Student8_Tel,
    Student9_Tel,
    Student10_Tel,
    Email_Student1,
    Email_Student2,
    Email_Student3,
    Email_Student4,
    Email_Student5,
    Email_Student6,
    Email_Student7,
    Email_Student8,
    Email_Student9,
    Email_Student10,
    Project_on_term_ID,
    Group_Member_ID,
  } = req.body;
  console.log(req.body);
  const sql =
    "UPDATE `groups` SET `Group_Name_Thai`=?,`Group_Name_Eng`=?,`Co_Advisor`=? WHERE `Group_ID`=?";
  const sql2 =
    "UPDATE `groupmembers` SET `User_Email`=?,`User_Phone`=?,`Group_Role`=?,`Project_on_term_ID`=?, `User_Status` = IF(`User_Status` = 2, 0, `User_Status`) WHERE `User_Email`=? AND `Group_ID`=?";
  const insert =
    "INSERT INTO `groupmembers`( `User_Email`, `User_Phone`, `Group_Role`,Project_on_term_ID, `Group_ID`) VALUES (?,?,?,?,?)";
  let user = [];
  let group = [];
  let error = 0;
  let success = 0;
  user.push([
    Email_Student1,
    Student1_Tel,
    3,
    Project_on_term_ID,
    Email_Student1,
    Group_ID,
  ]);

  if (Studen_Number > 1) {
    user.push([
      Email_Student2,
      Student2_Tel,
      2,
      Project_on_term_ID,
      Email_Student2,
      Group_ID,
    ]);
  }
  if (Studen_Number > 2) {
    user.push([
      Email_Student3,
      Student3_Tel,
      2,
      Project_on_term_ID,
      Email_Student3,
      Group_ID,
    ]);
  }
  if (Studen_Number > 3) {
    user.push([
      Email_Student4,
      Student4_Tel,
      2,
      Project_on_term_ID,
      Email_Student4,
      Group_ID,
    ]);
  }
  if (Studen_Number > 4) {
    user.push([
      Email_Student5,
      Student5_Tel,
      2,
      Project_on_term_ID,
      Email_Student5,
      Group_ID,
    ]);
  }
  if (Studen_Number > 5) {
    user.push([
      Email_Student6,
      Student6_Tel,
      2,
      Project_on_term_ID,
      Email_Student6,
      Group_ID,
    ]);
  }
  if (Studen_Number > 6) {
    user.push([
      Email_Student7,
      Student7_Tel,
      2,
      Project_on_term_ID,
      Email_Student7,
      Group_ID,
    ]);
  }
  if (Studen_Number > 7) {
    user.push([
      Email_Student8,
      Student8_Tel,
      2,
      Project_on_term_ID,
      Email_Student8,
      Group_ID,
    ]);
  }
  if (Studen_Number > 8) {
    user.push([
      Email_Student9,
      Student9_Tel,
      2,
      Project_on_term_ID,
      Email_Student9,
      Group_ID,
    ]);
  }
  if (Studen_Number > 9) {
    user.push([
      Email_Student10,
      Student10_Tel,
      2,
      Project_on_term_ID,
      Email_Student10,
      Group_ID,
    ]);
  }

  user.push([
    Advisor_Email,
    "",
    0,
    Project_on_term_ID,
    Advisor_Email,
    Group_ID,
  ]);
  user.push([
    Committee1_Email,
    "",
    1,
    Project_on_term_ID,
    Committee1_Email,
    Group_ID,
  ]);
  user.push([
    Committee2_Email,
    "",
    1,
    Project_on_term_ID,
    Committee2_Email,
    Group_ID,
  ]);
  if (CoAdvisor_Name == "" || CoAdvisor_Name == null) {
    group.push([Project_NameTh, Project_NameEn, "", Major]);
  } else {
    group.push([Project_NameTh, Project_NameEn, CoAdvisor_Name, Major]);
  }

  con.query(
    sql,
    [group[0][0], group[0][1], group[0][2], Group_ID],
    (err, result, fields) => {
      console.log(user);
      if (err) {
        console.log("error code first is " + err.sqlMessage);
        error++;
      } else {
        for (let i = 0; i < user.length; i++) {
          con.query(
            sql2,
            [
              user[i][0],
              user[i][1],
              user[i][2],
              user[i][3],
              user[i][4],
              user[i][5],
            ],
            (err, result, fields) => {
              console.log("success", result["affectedRows"]);
              if (result["affectedRows"] == 0) {
                con.query(
                  insert,
                  [user[i][0], user[i][1], user[i][2], user[i][3], user[i][5]],
                  (err, result, fields) => {
                    if (err) {
                      console.log("error code third is " + err.sqlMessage);
                    } else {
                      success++;
                    }
                  }
                );
              } else {
                success++;
              }
              if (err) {
                console.log("hear err" + error);
                res
                  .status(500)
                  .json({ msg: "Internal Server Error", status: 500 });
              }
            }
          );
        }
        res.status(200).json({ msg: "Create group Successed", status: 200 });
      }
    }
  );
  console.log("suss", success);
  console.log("user.length", user.length);
  // if (success == user.length) {
  //   console.log("successed");
  // }
  // if (error > 0) {
  //   res.status(500).json({ msg: "Internal Server Error", status: 500 });
  // }
};

// Get group based on ID (for my advisee, comittee pages)
getGroupWithID = async (req, res) => {
  const { Group_ID, Email, Project_on_term_ID } = req.body;

  try {
    // 1.) Select query for group members
    const sqlGroupMembers =
      "SELECT u.User_Email, u.User_Identity_ID, u.User_Name, u.User_Role, gm.Group_Role, gm.User_Status, gm.User_Phone FROM `groupmembers` gm INNER JOIN `users` u ON gm.User_Email = u.User_Email WHERE gm.Group_ID = ? AND gm.User_Status = 1 AND gm.Project_on_term_ID = ? ORDER BY gm.Group_Role DESC";
    // Group members result
    // First element in the returned array is 'row', the second is 'field'
    const [groupMembers] = await con
      .promise()
      .query(sqlGroupMembers, [Group_ID, Project_on_term_ID], (err) => {
        if (err) throw err;
      });

    // Check if the person is a member or not first, if not return failed to fetch
    if (!groupMembers.map((member) => member.User_Email).includes(Email))
      throw new Error("Not a member of this group");

    // 2.) Select query for group info
    const sqlGroupInfo =
      "SELECT g.Group_ID, g.Group_Name_Thai, g.Group_Name_Eng, g.Co_Advisor, g.Major, g.Group_Status, g.Group_Progression, g.Project_on_term_ID, g.Grade, g.Is_Re_Eval, g.Received_New_Grade, gm.Group_Role AS `Current_Member_Role`, gm.Group_Member_ID AS `Current_Member_ID` FROM `groups` g INNER JOIN `groupmembers` gm ON g.Group_ID = gm.Group_ID WHERE gm.User_Email = ? AND g.Group_ID = ?";
    // Group info result
    con.query(sqlGroupInfo, [Email, Group_ID], (err, groupInfo) => {
      if (err) throw err;
      res.status(200).json({ groupInfo, groupMembers, status: 200 });
      return;
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err, status: 500 });
    return;
  }
};

// Get current user group info if the student has one
getGroupInfo = (req, res) => {
  const { User_Email, Project_on_term_ID } = req.body;
  const sql =
    "SELECT gm.Group_Member_ID, gm.User_Phone, gm.Group_Role, gm.Group_ID, gm.User_Status, g.Major, g.Group_Name_Thai, g.Group_Name_Eng, g.Co_Advisor, g.Group_Status, g.Group_Progression, g.Grade, g.Is_Re_Eval, g.Received_New_Grade, g.Project_on_term_ID FROM `groupmembers` gm INNER JOIN `groups` g ON gm.Group_ID = g.Group_ID WHERE gm.User_Email = ? AND gm.Project_on_term_ID = ? AND NOT gm.User_Status = 2 AND NOT g.Group_Status = 0";
  con.query(sql, [User_Email, Project_on_term_ID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// Get current user group info if the student has one
getGroupMajor = (req, res) => {
  const { Group_ID } = req.body;
  const sql =
    "SELECT DISTINCT `Major_Name` FROM `majors` WHERE `Major_ID` IN (SELECT `Major_ID` FROM `users` WHERE `User_Email` IN (SELECT `User_Email` FROM `groupmembers` WHERE `Group_ID`= ? AND `User_Status` !=2 AND (`Group_Role` = 3 || `Group_Role` = 2)));";
  con.query(sql, [Group_ID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};
// Get group members for filling in the create group page form
getGroupMembers = (req, res) => {
  const { Group_ID } = req.body;
  const sql =
    "SELECT u.User_Email, u.User_Identity_ID, u.User_Name, u.User_Role, gm.Group_Role, gm.User_Phone, gm.User_Status FROM `groupmembers` gm INNER JOIN `users` u ON gm.User_Email = u.User_Email AND gm.Project_on_term_ID = u.Project_on_term_ID WHERE gm.Group_ID = ? AND NOT gm.User_Status = 2 ORDER BY gm.Group_Role DESC";
  con.query(sql, [Group_ID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// Get group based on project on term (ie. academic year and semester)
getAllGroupsAdmin = (req, res) => {
  const { Year, Semester, Major, Senior } = req.body;
  const sql =
    "SELECT gp.Group_ID, gp.Group_Name_Thai, gp.Group_Name_Eng, gp.Co_Advisor, gp.Group_Status, (SELECT Major_Name FROM majors WHERE Major_Id = ?)AS Major, (SELECT users.User_Name FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email AND users.Project_on_term_ID = gm.Project_on_term_ID WHERE gm.Group_Role = 0 AND gm.User_Status = 1 AND gm.Group_ID=gp.Group_ID) AS Advisor, (SELECT GROUP_CONCAT(User_Name) FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email WHERE gm.User_Status = 1 AND (gm.Group_Role = 2 OR gm.Group_Role = 3 AND gm.Group_ID=gp.Group_ID)) AS Students, (SELECT GROUP_CONCAT(User_Name) FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email WHERE gm.Group_Role = 1 AND gm.User_Status = 1 AND gm.Group_ID=gp.Group_ID) AS Committee, gp.Project_on_term_ID FROM `groups` gp WHERE Project_on_term_ID = (SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year = ? AND Academic_Term = ? AND Senior = ?) AND Major = ? AND Group_Status = 1";
  con.query(
    sql,
    [Major, Year, Semester, Senior, Major],
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

// Get teachers with score on each progress, using group id
getTeachersWithGroupID = (req, res) => {
  const { Group_ID, Progress_ID, Project_on_term_ID } = req.body;
  const getTeachersProgressSql =
    "SELECT gm.Group_Member_ID, gm.User_Email, gm.Group_Role, sc.Score, sc.Max_Score, sc.Comment, (SELECT `User_Name` FROM `users` WHERE `User_Email` = gm.User_Email) AS `User_Name` FROM `groupmembers` gm LEFT JOIN `scores` sc ON sc.Group_Member_ID = gm.Group_Member_ID WHERE gm.Group_ID = ? AND sc.Assignment_ID = (SELECT `Assignment_ID` FROM `assignments` WHERE `Progress_ID` = ? AND `Group_ID` = ?) AND gm.Project_on_term_ID = ? AND gm.Group_Role IN (0,1)";
  try {
    con.query(
      getTeachersProgressSql,
      [Group_ID, Progress_ID, Group_ID, Project_on_term_ID],
      (err, result, fields) => {
        if (err) throw err;
        res.status(200).json({
          advisor: result.filter((teacher) => teacher.Group_Role === 0)[0],
          committees: result.filter((teacher) => teacher.Group_Role === 1),
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
    return;
  }
};

// Get eval comment of advisor and 2 committees (for eval page)
// This could be all teachers(use in student side) or only one(use in teacher side)
getTeachersEval = (req, res) => {
  const {
    Email,
    Group_ID,
    Single,
    Group_Info,
    reEvalComment,
    filterTeachersRole = false,
  } = req.body;
  try {
    // Check if 'Single' is true, if it is then query for single teacher eval comment using email
    const getTeachersEval = `SELECT ec.Comment, ec.File_Name, gm.Group_Role, gm.Group_Member_ID, u.User_Name FROM groupmembers gm INNER JOIN evalcomment ec ON gm.Group_Member_ID = ec.Group_Member_ID INNER JOIN users u ON gm.User_Email = u.User_Email WHERE ${
      Single ? "gm.User_Email = ? AND" : ""
    } ec.Group_ID = ? ${
      reEvalComment ? "AND ec.Re_Eval = 1" : "AND ec.Re_Eval = 0"
    }`;
    // console.log("GetTeachersEvalSQL: ", getTeachersEval);

    // 1.) Select eval comment(s)
    // Here rest parameter syntax is used for conditionally spread element in the array
    con.query(
      getTeachersEval,
      [...(Single ? [Email] : []), Group_ID],
      (err, evalResult) => {
        if (err) throw err;
        console.log("Eval result: ", evalResult);

        // 2.) In some case, group info may also needed (for getting the grade) If it's needed, query for group info next
        // This query includes 'Current_Member_Role' and 'Current_Member_ID'
        if (Group_Info) {
          const getGroupWithId =
            "SELECT g.Group_ID, g.Group_Name_Thai, g.Group_Name_Eng, g.Co_Advisor, g.Major, g.Group_Status, g.Group_Progression, g.Project_on_term_ID, g.Grade, g.Is_Re_Eval, g.Received_New_Grade, gm.Group_Role AS `Current_Member_Role`, gm.Group_Member_ID AS `Current_Member_ID` FROM `groups` g INNER JOIN `groupmembers` gm ON g.Group_ID = gm.Group_ID WHERE gm.User_Email = ? AND g.Group_ID = ?";
          con.query(getGroupWithId, [Email, Group_ID], (err, groupResult) => {
            if (err) throw err;
            console.log("Group info result: ", groupResult);
            res.status(200).json({ eval: evalResult, group: groupResult[0] });
          });
        } else {
          // If the filterTeachersRole flag is true, then filter teachers based on their role
          const data = filterTeachersRole
            ? {
                advisor: evalResult.filter(
                  (teacher) => teacher.Group_Role === 0
                )[0],
                committees: evalResult.filter(
                  (teacher) => teacher.Group_Role === 1
                ),
              }
            : { eval: evalResult };
          // If no request for group info then only response with evalResult
          res.status(200).json(data);
          return;
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
    return;
  }
};

// get all group
// TODO: get by major
getByMajor = (req, res) => {
  const major = req.body.Major;

  const sql = "SELECT * FROM `groups` WHERE Major = ?";
  con.query(sql, [major], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

getByRole = (req, res) => {
  const Email = req.body.Email;

  const sql =
    "SELECT COUNT(Group_Member_ID) AS commitee,(SELECT COUNT(Group_Member_ID) FROM `groupmembers` WHERE User_Email = ? AND Group_Role = 0) AS advicee FROM `groupmembers` WHERE User_Email = ? AND Group_Role = 1;";
  con.query(sql, [Email, Email], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

deletes = (req, res) => {
  // const groupId = req.body.Group_ID;
  // const sql = "UPDATE `groups` SET `Group_Status` = 0 WHERE `Group_ID` = ?;";
  const { data } = req.body;
  const sql =
    "INSERT INTO `groups`(`Group_ID`, `Group_Status`) VALUES ? ON DUPLICATE KEY UPDATE Group_Status=VALUES(Group_Status)";
  con.query(
    sql,
    [data.map((itm) => Object.values(itm))],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        const deleteIDs = data.map((itm) => itm.Group_ID);
        res.status(200).json({ msg: "sucess", status: 200, result: deleteIDs });
      }
    }
  );
};

// delete by id for advisor
deleteById = (req, res) => {
  const Group_ID = req.body.Group_ID;
  const sql = "UPDATE `groups` SET `Group_Status` = 0 WHERE `Group_ID` = ?";
  con.query(sql, [Group_ID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json({ msg: "deleted", status: 200 });
    }
  });
};

getOnlyGroupWithID = (req, res) => {
  const { Group_ID } = req.body;
  const getOnlyGroup = "SELECT * FROM `groups` WHERE `Group_ID` = ?";
  try {
    con.query(getOnlyGroup, [Group_ID], (err, result) => {
      if (err) throw err;
      res.status(200).json(result[0]);
      return;
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err, status: 500 });
    return;
  }
};

statusgroup = (req, res) => {
  const { User_Status, User_Email, Group_Id } = req.body;
  const sql =
    "UPDATE groupmembers SET User_Status =? WHERE User_Email = ? AND Group_ID = ?;";
  con.query(sql, [User_Status, User_Email, Group_Id], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// Use for update group member status after user accept or decline group invitation
updateMemberStatus = (req, res) => {
  const { Status, User_Email, Group_Id, Major } = req.body;
  console.log(Status, User_Email, Group_Id, Major);
  const sql =
    "UPDATE `groupmembers` SET `User_Status`= ? WHERE Group_ID = ? AND User_Email = ?";
  const updateGroup =
    "UPDATE `groups` SET `Major`=(SELECT `Major_ID` FROM `majors` WHERE `Major_Name` = ? ) WHERE `Group_ID` = ?;";
  try {
    con.query(sql, [Status, Group_Id, User_Email], (err, result, fields) => {
      if (err) {
        throw err;
      } else {
        if (Major != "" && Major != null) {
          con.query(updateGroup, [Major, Group_Id], (err, result2, fields2) => {
            if (err) {
              throw err;
            } else {
              res.status(200).json({ msg: "Success", status: 200 });
            }
          });
        } else {
          res.status(200).json({ msg: "Success", status: 200 });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Interal Server Error", status: 500 });
    return;
  }
};

getScoreCoor = (req, res) => {
  const { Major, Academic_Year, Academic_Term } = req.body;
  console.log(req.body);
  // const major = req.body.Major;
  // const Projectonterm = req.body.Projectonterm;

  const sql =
    "SELECT st.User_Identity_ID as Id,st.User_Name AS Name,tea.User_Name AS Advisor ,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=2 AND ass.Group_ID=gm.Group_ID) AS Proposal, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=3 AND ass.Group_ID=gm.Group_ID) AS Progress1,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=4 AND ass.Group_ID=gm.Group_ID) AS Progress2,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=5 AND ass.Group_ID=gm.Group_ID) AS Progress3,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=6 AND ass.Group_ID=gm.Group_ID) AS Progress4,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=7 AND ass.Group_ID=gm.Group_ID) AS FinalPresentation,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=8 AND ass.Group_ID=gm.Group_ID) AS FinalDocumentation,(SELECT Grade FROM groups WHERE Group_ID = (SELECT Group_ID FROM groupmembers WHERE User_Email = st.User_Email AND`User_Status` = 1 AND`Project_on_term_ID` =st.`Project_on_term_ID`)) AS Grade FROM users st,groupmembers gm, users tea WHERE st.Project_on_term_ID = (SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND gm.User_Email = st.User_Email AND st.User_Role = 1 AND tea.User_Email =(SELECT User_Email FROM groupmembers WHERE Group_Role = 0 AND Group_ID = (SELECT Group_ID FROM groupmembers WHERE User_Email = st.User_Email)) AND st.Major_ID = ?";
  con.query(
    sql,
    [Academic_Year, Academic_Term, Major],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        result = result.map(
          (el) => (
            (grade = el.Grade),
            delete el.Grade,
            {
              ...el,
              Total: parseInt(
                +el.Proposal +
                  +el.Progress1 +
                  +el.Progress2 +
                  +el.Progress3 +
                  +el.Progress4 +
                  +el.FinalPresentation +
                  +el.FinalDocumentation
              ),
              Grade: grade,
            }
          )
        );

        res.status(200).json(result);
      }
    }
  );
};

getGroupScore = (req, res) => {
  const Group_ID = req.body.Group_ID;

  const sql =
    "SELECT gmb.Group_Member_ID, usr.User_Email,usr.User_Identity_ID, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=1 AND ass.Group_ID=?) AS progress1, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=2 AND ass.Group_ID=?) AS progress2, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=3 AND ass.Group_ID=?) AS progress3, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=4 AND ass.Group_ID=?) AS progress4, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=5 AND ass.Group_ID=?) AS FinalPresentation, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=6 AND ass.Group_ID=?) AS FinalDocumentation, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=7 AND ass.Group_ID=?) AS Topic, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=8 AND ass.Group_ID=?) AS Groups , (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Group_ID=?) AS Total  FROM users usr INNER JOIN groupmembers gmb ON usr.User_Email = gmb.User_Email INNER JOIN groups gp ON gmb.Group_ID=gp.Group_ID WHERE gmb.Group_ID=? AND usr.Project_on_term_ID=gmb.Project_on_term_ID AND (gmb.Group_Role=2 OR gmb.Group_Role=3)";
  con.query(
    sql,
    [
      Group_ID,
      Group_ID,
      Group_ID,
      Group_ID,
      Group_ID,
      Group_ID,
      Group_ID,
      Group_ID,
      Group_ID,
      Group_ID,
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

// list group that teacher are advisor or committee
listOwnGroup = (req, res) => {
  console.log(req.body);
  const { User_Email, Year, Semester, Group_Role } = req.body;
  const sql =
    "SELECT Group_ID,Group_Name_Thai,Group_Name_Eng,Co_Advisor,(SELECT Major_Name FROM majors WHERE Major_ID = Major)AS Major,Group_Progression, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=0 ) AS Advisor, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=1 ) AS Committees,(SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND ( gmb.Group_Role=2 OR gmb.Group_Role=3) ) AS Students FROM (SELECT groups.Group_ID AS Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression,groupmembers.User_Email AS Members, groupmembers.User_Phone,groupmembers.Group_Role AS Roles FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND Group_Role=? AND User_Status = 1) AND groups.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND groups.Group_Status=1 ) AS subquery GROUP BY subquery.Group_ID";
  // const sql = 'SELECT groups.Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression ,groupmembers.Group_Member_ID,GROUP_CONCAT(  DISTINCT groupmembers.User_Email ORDER BY groupmembers.User_Email)AS Member,groupmembers.User_Phone,groupmembers.Group_Role FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =?) AND groups.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND groups.Group_Status=1 GROUP BY groups.Group_ID'
  // const sql =
  // "SELECT * FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND Group_Role=?) AND groups.Project_on_term_ID=?";
  con.query(
    sql,
    [User_Email, Group_Role, Year, Semester],
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

listrequestGroup = (req, res) => {
  console.log(req.body);
  const {
    User_Email,
    Project_on_term_ID,
    Group_Role,
    User_Status,
    Group_Role2,
  } = req.body;
  const sql =
    "SELECT Group_ID,Group_Name_Thai,Group_Name_Eng,Co_Advisor,(SELECT Major_Name FROM majors WHERE Major_ID = Major)AS Major,Group_Progression, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=0 ) AS Advisor, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=1 ) AS Committees,(SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND ( gmb.Group_Role=2 OR gmb.Group_Role=3) ) AS Students FROM (SELECT groups.Group_ID AS Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression,groupmembers.User_Email AS Members, groupmembers.User_Phone,groupmembers.Group_Role AS Roles FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND (Group_Role=? OR Group_Role=?) AND User_Status = ?) AND groups.Project_on_term_ID=? AND groups.Group_Status=1 ) AS subquery GROUP BY subquery.Group_ID";
  // const sql = 'SELECT groups.Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression ,groupmembers.Group_Member_ID,GROUP_CONCAT(  DISTINCT groupmembers.User_Email ORDER BY groupmembers.User_Email)AS Member,groupmembers.User_Phone,groupmembers.Group_Role FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =?) AND groups.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND groups.Group_Status=1 GROUP BY groups.Group_ID'
  // const sql =
  // "SELECT * FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND Group_Role=?) AND groups.Project_on_term_ID=?";
  con.query(
    sql,
    [User_Email, Group_Role, Group_Role2, User_Status, Project_on_term_ID],
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

getMyGroup = (req, res) => {
  const groupId = req.body.Group_ID;
  const sql =
    "SELECT gmb.Group_Member_ID, gp.Group_ID,gp.Major,gp.Project_on_term_ID,gp.Group_Name_Thai,gp.Group_Name_Eng,gp.Grade,gp.Is_Re_Eval,gp.Co_Advisor,usr.User_Name,gmb.Group_Role,usr.User_Email,usr.User_Identity_ID,gmb.User_Phone,gmb.User_Status FROM groups gp INNER JOIN groupmembers gmb ON gp.Group_ID=gmb.Group_ID INNER JOIN users usr ON gmb.User_Email=usr.User_Email AND gmb.Project_on_term_ID=usr.Project_on_term_ID WHERE gmb.Group_ID=? AND gmb.User_Status=1 ORDER BY gmb.Group_Member_ID";
  con.query(sql, [groupId], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

grading = async (req, res) => {
  const {
    Group_ID,
    isAdvisor,
    Grade,
    isReEval,
    newEvalScore,
    reEvalComment = false,
    Comment,
    Group_Member_ID,
    Assignment_ID,
  } = req.body;

  // If there is a file (re-eval grading) then create variable of the file name
  let fileName = "";
  if (!!req.file) {
    fileName = req.file.filename;
  }
  // console.log("=========== DEBUG ==============");

  try {
    // Begin transaction
    await conPromise.beginTransaction((err) => {
      if (err) throw err;
    });
    // 1.) Insert comment in 'evalcomment' table
    const insertEvalComment = `INSERT INTO evalcomment(Comment, File_Name, Group_Member_ID, Group_ID${
      reEvalComment ? ", Re_Eval" : ""
    }) VALUES (?, ?, ?, ?${reEvalComment ? ", 1" : ""})`;
    await conPromise.execute(
      insertEvalComment,
      [Comment, fileName, Group_Member_ID, Group_ID],
      (err) => {
        if (err) throw err;
      }
    );

    // 2.) If is advisor, then update grade in 'groups' table
    if (isAdvisor && Grade) {
      // isReEval indicate that advisor gave an "I"
      const updateGrade = `UPDATE groups SET Grade = ?, Is_Re_Eval = ${
        isReEval ? 1 : 0
      }, Received_New_Grade = ${newEvalScore ? 1 : 0} ${
        isReEval ? ", Group_Progression = 10" : ""
      } WHERE groups.Group_ID = ?`;
      await conPromise.execute(updateGrade, [Grade, Group_ID], (err) => {
        if (err) throw err;
      });
    }

    // If there is a file
    // TODO: Also check if this is re -eval grading ?
    if (!!req.file && !!Assignment_ID) {
      // 3.) Insert files into database
      const filesSql =
        "INSERT INTO files(File_Name, Path, Type, Assignment_ID, Group_Member_ID) VALUES (?, ?, ?, ?, ?)";
      await conPromise.execute(
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

    // Commit
    await conPromise.commit();
    res.status(200).json({ msg: "Insert successfully", status: 200 });
    return;
  } catch (err) {
    console.log(err);
    conPromise.rollback();
    console.log("Rollback successfully");
    res.status(500).json({ msg: "Interal Server Error", status: 500 });
    return;
  }
  // Check if isAdvisor is true, if it is then 'UPDATE' grade query will execute

  // const grade = "UPDATE `groups` SET `Grade` = ? WHERE `groups`.`Group_ID` = ?";
  // const finalGrade =
  //   "UPDATE `groups` SET `Is_Re_Eval` = ? WHERE `groups`.`Group_ID` = ?";

  // const commentGrade =
  //   "UPDATE `groups` SET `Comment_Grade` = ? WHERE `groups`.`Group_ID` = ?";

  // const commentFinalGrade =
  //   "UPDATE `groups` SET `Comment_FinalGrade` = ? WHERE `groups`.`Group_ID` = ?";

  // con.query(
  //   event == 0 ? grade : finalGrade,
  //   [Grade, Group_ID],
  //   (err, result, fields) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).json({ msg: "Internal Server Error", status: 500 });
  //     } else {
  //       con.query(
  //         event == 0 ? commentGrade : commentFinalGrade,
  //         [Comment, Group_ID],
  //         (err, result, fields) => {
  //           if (err) {
  //             console.log(err);
  //             res
  //               .status(500)
  //               .json({ msg: "Internal Server Error", status: 500 });
  //           } else {
  //             res.status(200).json({ msg: "graded", status: 200 });
  //           }
  //         }
  //       );

  //       // res.status(200).json({ msg: 'graded', status: 200 })
  //     }
  //   }
  // );
};

countTeachergroup = (req, res) => {
  // count amount of my group and group request
  const { User_Email, Project_on_term_ID } = req.body;
  const sql =
    "SELECT ( SELECT COUNT(*) FROM groups gp INNER JOIN groupmembers gmb ON gp.Group_ID=gmb.Group_ID WHERE gmb.User_Email=? AND gmb.Project_on_term_ID=? AND gmb.Group_Role=0 AND gmb.User_Status=1) AS Advisor, ( SELECT COUNT(*) FROM groups gp INNER JOIN groupmembers gmb ON gp.Group_ID=gmb.Group_ID WHERE gmb.User_Email=? AND gmb.Project_on_term_ID=? AND gmb.Group_Role=1 AND gmb.User_Status=1) AS Committee, ( SELECT COUNT(*) FROM groups gp INNER JOIN groupmembers gmb ON gp.Group_ID=gmb.Group_ID WHERE gmb.User_Email=? AND gmb.Project_on_term_ID=? AND gmb.User_Status=0) AS GroupRequest";
  con.query(
    sql,
    [
      User_Email,
      Project_on_term_ID,
      User_Email,
      Project_on_term_ID,
      User_Email,
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

countProgressGroup = (req, res) => {
  // count amount of my group and group request
  const { Project_on_term_ID } = req.body;
  const sql =
    "SELECT COUNT(Major_ID) as numberPro , Major_ID FROM `scorecriterias` WHERE Project_on_term_ID = ? GROUP BY Major_ID ORDER BY numberPro DESC";
  con.query(sql, [Project_on_term_ID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

getAllFilesMajor = (req, res) => {
  const { Academic_Year, Academic_Term, Major } = req.body;
  // console.log(req.body);

  const sql =
    "SELECT  `File_Name` AS fileName, `Path` AS path, `Type` AS type,(SELECT `Submit_Date` FROM `assignments` WHERE `Assignment_ID` = files.Assignment_ID) AS submitDate, (SELECT  `Group_Name_Eng` FROM `groups` WHERE `Group_ID` =(SELECT `Group_ID` FROM groupmembers WHERE Group_Member_ID = files.Group_Member_ID)) AS groupName FROM `files` WHERE Assignment_ID IN (SELECT `Assignment_ID` FROM `assignments` WHERE Group_ID IN (SELECT DISTINCT Group_ID FROM groupmembers WHERE User_Email IN (SELECT `User_Email` FROM `users` WHERE Project_on_term_ID =(SELECT Project_on_term_ID FROM `projectonterm` WHERE Academic_Year=? AND Academic_Term=?) AND `Major_ID` = ?)))";

  con.query(
    sql,
    [Academic_Year, Academic_Term, Major],
    (err, result, fields) => {
      if (err) {
        res.status(422).json({ msg: "Query Error", status: 422 });
      } else {
        res.status(200).json(result);
      }
    }
  );
};
addGroupToSeTwo = (req, res) => {
  let gThname = "";
  let gEnname = "";
  let gAdvi = "";
  let major = "";
  let errors = 0;
  const { Project_on_term_ID } = req.body;

  console.log(req.body);
  const selectGroup =
    "SELECT  `Group_Name_Thai`, `Group_Name_Eng`, `Co_Advisor`, `Major` FROM `groups` WHERE Project_on_term_ID = (SELECT MAX(Project_on_term_ID) FROM projectonterm WHERE Senior = 1 AND Project_on_term_ID IN (SELECT Project_on_term_ID from groupmembers))";
  const addGroup =
    "INSERT INTO `groups`( `Group_Name_Thai`, `Group_Name_Eng`, `Co_Advisor`, `Major`, `Project_on_term_ID`) VALUES(?,?,?,?,?);";
  const selectuser =
    "SELECT `User_Email`, `User_Phone`, `Group_Role`,(SELECT `Group_Name_Eng` FROM `groups` WHERE `Group_ID` = `groupmembers`.`Group_ID`) as groupname FROM `groupmembers` WHERE groupmembers.Project_on_term_ID =(SELECT MAX(Project_on_term_ID) FROM projectonterm WHERE Senior =1 AND Project_on_term_ID IN (SELECT Project_on_term_ID from groupmembers))";
  const adduser =
    "INSERT IGNORE INTO `groupmembers`( `User_Email`, `User_Phone`, `Group_Role`, `Group_ID`, `Project_on_term_ID`) VALUES (?,?,?,(SELECT MAX(Group_ID) FROM groups WHERE Group_Name_Eng =?),?)";
  con.query(selectGroup, (err1, resultGroup, fields1) => {
    if (err1) {
      console.log(err1);
      errors++;
      res.status(422).json({ msg: "Query Error", status: 422 });
    } else {
      for (let i = 0; i < resultGroup.length; i++) {
        gThname = resultGroup[i].Group_Name_Thai;
        gEnname = resultGroup[i].Group_Name_Eng;
        gAdvi = resultGroup[i].Co_Advisor;
        major = resultGroup[i].Major;

        // groupinfo.push([])
        con.query(
          addGroup,
          [gThname, gEnname, gAdvi, major, Project_on_term_ID],
          (err, resultadd, fields) => {
            if (err) {
              console.log(err);
              errors++;
              //   res.status(422).json({ msg: "Query Error", status: 422 });
              //   break;
            } else {
              //   console.log("ji")
            }
          }
        );
      }
      // console.log(groupinfo)
    }
  });
  // if (errors == 0) {
  con.query(selectuser, (err1, resultUser, fields1) => {
    if (err1) {
      console.log(err1);
      res.status(422).json({ msg: "Query Error", status: 422 });
    } else {
      for (let i = 0; i < resultUser.length; i++) {
        con.query(
          adduser,
          [
            resultUser[i].User_Email,
            resultUser[i].User_Phone,
            resultUser[i].Group_Role,
            resultUser[i].groupname,
            Project_on_term_ID,
          ],
          (err, resultAdd, fields1) => {
            if (err1) {
              errors++;
              console.log(err1);
              // res.status(422).json({ msg: "Query Error", status: 422 });
              // break;
            } else {
            }
          }
        );
      }
    }
  });
  // }
  if (errors > 0) {
    res.status(422).json({ msg: "Query Error", status: 422 });
  } else {
    res.status(200).json({ msg: "Success", status: 200 });
  }
};

countOwnGroup = (req, res) => {
  // count group that is advisor or committee
  const { Academic_Year, Academic_Term } = req.body;
  // console.log(req.body);

  const countGroup =
    "SELECT subquery.User_Email,subquery.User_Name,(SELECT COUNT(Group_Role) FROM groupmembers WHERE Group_Role=0 AND Group_Member_ID=subquery.Group_Member_ID)AS Advisor,(SELECT COUNT(Group_Role) FROM groupmembers WHERE Group_Role=1 AND Group_Member_ID=subquery.Group_Member_ID)AS Committee FROM (SELECT gmb.Group_Member_ID,usr.User_Email,usr.User_Name,usr.User_Role FROM groupmembers gmb RIGHT JOIN users usr ON gmb.User_Email=usr.User_Email WHERE usr.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND (usr.User_Role=0 OR usr.User_Role=2))AS subquery ORDER BY User_Name ASC";

  con.query(
    countGroup,
    [Academic_Year, Academic_Term],
    (err, result, fields) => {
      if (err) {
        res.status(422).json({ msg: "Query Error", status: 422 });
      } else {
        res.status(200).json({ data: result, status: 200 });
      }
    }
  );
};

module.exports = {
  getAll,
  getGroupWithID,
  getOnlyGroupWithID,
  getGroupInfo,
  getGroupMembers,
  getTeachersWithGroupID,
  getTeachersEval,
  createGroup,
  statusgroup,
  getByMajor,
  deletes,
  getByRole,
  listOwnGroup,
  getScoreCoor,
  getGroupScore,
  getAllGroupsAdmin,
  listrequestGroup,
  updateMemberStatus,
  getMyGroup,
  grading,
  deleteById,
  updateGroup,
  getOnlyGroupWithID,
  countTeachergroup,
  getAllFilesMajor,
  addGroupToSeTwo,
  countProgressGroup,
  getGroupMajor,
  countOwnGroup,
};
