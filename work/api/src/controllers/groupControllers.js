const { result } = require("lodash");
const con = require("../config/db");

createGroup = async (req, res) => {
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
    Email_Student1,
    Major,
    Email_Student2,
    Email_Student3,
    Email_Student4,
    Project_on_term_ID
  } = req.body;
  console.log(req.body);
  const sql =
    "INSERT INTO groups (Group_Name_Thai,Group_Name_Eng,Co_Advisor,Major,Project_on_term_ID) VALUES (?,?,?,?,?);";
  const sql2 =
    "INSERT INTO `groupmembers`( `User_Email`, `User_Phone`, `Group_Role`,Project_on_term_ID, `Group_ID`) VALUES (?,(SELECT MAX(Group_ID) FROM groups))";
  let user = [];
  let group = [];
  let error = 0;
  let success = 0;
  user.push([Email_Student1, Student1_Tel, 3, Project_on_term_ID]);

  if (Studen_Number == 2) {
    user.push([Email_Student2, Student2_Tel, 2, Project_on_term_ID]);
  } else if (Studen_Number == 3) {
    user.push([Email_Student2, Student2_Tel, 2, Project_on_term_ID]);
    user.push([Email_Student3, Student3_Tel, 2, Project_on_term_ID]);
  } else if (Studen_Number == 4) {
    user.push([Email_Student3, Student3_Tel, 2, Project_on_term_ID]);
    user.push([Email_Student4, Student4_Tel, 2, Project_on_term_ID]);
  }
  user.push([Advisor_Email, "", 0, Project_on_term_ID]);
  user.push([Committee1_Email, "", 1, Project_on_term_ID]);
  user.push([Committee2_Email, "", 1, Project_on_term_ID]);
  if (CoAdvisor_Name == "" || CoAdvisor_Name == null) {
    group.push([Project_NameTh, Project_NameEn, "", Major, Project_on_term_ID]);
  } else {
    group.push([
      Project_NameTh,
      Project_NameEn,
      CoAdvisor_Name,
      Major,
      Project_on_term_ID
    ]);
  }

  await con.query(sql, group[0], async (err, result, fields) => {
    if (err) {
      console.log("error code first is " + err.code);
      error++;
    } else {
      for (let i = 0; i < user.length; i++) {
        console.log(user[i]);
        await con.query(sql2, [user[i]], (err, result, fields) => {
          if (err) {
            console.log("error code second is " + err.code);
          } else {
            success++;
          }
        });
      }
    }
  });
  if (success == user.length) {
    res.status(200).send("Success");
  }
  if (error > 0) {
    res.status(500).send("Internal Server Error");
  }
};

// Get group based on ID (for my advisee, comittee pages)
getGroupWithID = (req, res) => {
  const { Group_ID, Email } = req.body;

  try {
    // Query for group members
    const sqlGroupMembers =
      "SELECT u.User_Email, u.User_Identity_ID, u.User_Name, u.User_Role, gm.Group_Role, gm.User_Status, gm.User_Phone  FROM `groupmembers` gm INNER JOIN `users` u ON gm.User_Email = u.User_Email WHERE gm.Group_ID = ? AND gm.User_Status = 1 ORDER BY gm.Group_Role DESC";
    con.query(
      sqlGroupMembers,
      [Group_ID],
      async (err, groupMembers, fields) => {
        if (err) throw err;

        // Check if the person is a member or not first, if not return failed to fetch
        if (!groupMembers.map(itm => itm.User_Email).includes(Email))
          res.json({ msg: "Failed to fetch", status: 404 });

        // Query for group info
        const sqlGroupInfo =
          "SELECT g.Group_ID, g.Group_Name_Thai, g.Group_Name_Eng, g.Co_Advisor, g.Major, g.Group_Status, g.Group_Progression, g.Project_on_term_ID, g.Grade, g.Final_Grade, g.Comment_Grade, g.Comment_FinalGrade, gm.Group_Role AS `Current_Member_Role`, gm.Group_Member_ID AS `Current_Member_ID` FROM `groups` g INNER JOIN `groupmembers` gm ON g.Group_ID = gm.Group_ID WHERE gm.User_Email = ? AND g.Group_ID = ?";
        const groupInfo = await new Promise((resolve, reject) => {
          if (err) throw err;
          con.query(
            sqlGroupInfo,
            [Email, Group_ID],
            (err, groupInfo, fields) => {
              resolve(groupInfo);
            }
          );
        });
        // Response here
        res.status(200).json({ groupInfo, groupMembers, status: 200 });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

// Get current user group info if the student has one
getGroupInfo = async (req, res) => {
  const { User_Email, Project_on_term_ID } = req.body;
  const sql =
    "SELECT gm.Group_Member_ID, gm.User_Phone, gm.Group_Role, gm.Group_ID, g.Group_Name_Thai, g.Group_Name_Eng, g.Co_Advisor, g.Group_Status,g.Group_Progression, g.Grade, g.Final_Grade FROM `groupmembers` gm INNER JOIN `groups` g ON gm.Group_ID = g.Group_ID WHERE gm.User_Email = ? AND gm.Project_on_term_ID = ? AND NOT gm.User_Status = 2 AND NOT g.Group_Status = 0";
  con.query(sql, [User_Email, Project_on_term_ID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// Get group members for filling in the create group page form
getGroupMembers = async (req, res) => {
  const { Group_ID } = req.body;
  const sql =
    "SELECT u.User_Email, u.User_Identity_ID, u.User_Name, u.User_Role, gm.Group_Role, gm.User_Phone FROM `groupmembers` gm INNER JOIN `users` u ON gm.User_Email = u.User_Email WHERE gm.Group_ID = ? AND NOT gm.User_Status = 2 ORDER BY gm.Group_Role DESC";
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
getAllGroupsAdmin = async (req, res) => {
  const { Year, Semester, Major } = req.body;
  const sql =
    "SELECT Group_ID, Group_Name_Thai, Group_Name_Eng, Co_Advisor, Group_Status, (SELECT Major_Name FROM majors WHERE Major_Id = ?)AS Major, (SELECT User_Name FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email WHERE gm.Group_Role = 0 AND gm.User_Status = 1) AS Advisor, (SELECT GROUP_CONCAT(User_Name) FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email WHERE gm.User_Status = 1 AND (gm.Group_Role = 2 OR gm.Group_Role = 3)) AS Students, (SELECT GROUP_CONCAT(User_Name) FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email WHERE gm.Group_Role = 1 AND gm.User_Status = 1) AS Committee FROM `groups` WHERE Project_on_term_ID = (SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year = ? AND Academic_Term = ?) AND Major = ? AND Group_Status = 1";
  con.query(sql, [Major, Year, Semester, Major], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

// Get group student progress page
getTeachersWithGroupID = (req, res) => {
  const { Group_ID, Project_on_term_ID } = req.body;
  console.log(Group_ID, Project_on_term_ID);
  const sql =
    "SELECT `Group_Member_ID`, `User_Email`, `Group_Role`, (SELECT `User_Name` FROM `users` WHERE `User_Email` = gm.User_Email) AS `User_Name` FROM `groupmembers` gm WHERE `Group_ID` = ? AND `Project_on_term_ID` = ? AND `Group_Role` IN (0,1)";
  try {
    con.query(sql, [Group_ID, Project_on_term_ID], (err, result, fields) => {
      if (err) throw err;
      res
        .status(200)
        .json({
          advisor: result.filter(teacher => teacher.Group_Role === 0)[0],
          committees: result.filter(teacher => teacher.Group_Role === 1)
        });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

// get all group
// TODO: get by major
getByMajor = async (req, res) => {
  const major = req.body.Major;

  const sql = "SELECT * FROM `groups` WHERE Major = ?";
  await con.query(sql, [major], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

getByRole = async (req, res) => {
  const Email = req.body.Email;

  const sql =
    "SELECT COUNT(Group_Member_ID) AS commitee,(SELECT COUNT(Group_Member_ID) FROM `groupmembers` WHERE User_Email = ? AND Group_Role = 0) AS advicee FROM `groupmembers` WHERE User_Email = ? AND Group_Role = 1;";
  await con.query(sql, [Email, Email], async (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

deletes = async (req, res) => {
  // const groupId = req.body.Group_ID;
  // const sql = "UPDATE `groups` SET `Group_Status` = 0 WHERE `Group_ID` = ?;";
  const { data } = req.body;
  const sql =
    "INSERT INTO `groups`(`Group_ID`, `Group_Status`) VALUES ? ON DUPLICATE KEY UPDATE Group_Status=VALUES(Group_Status)";
  con.query(
    sql,
    [data.map(itm => Object.values(itm))],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        const deleteIDs = data.map(itm => itm.Group_ID);
        res.status(200).json({ msg: "sucess", status: 200, result: deleteIDs });
      }
    }
  );
};

// delete by id for advisor
deleteById = async (req, res) => {
  const Group_ID = req.body.Group_ID;
  const sql = "UPDATE `groups` SET `Group_Status` = 0 WHERE `Group_ID` = ?";
  await con.query(sql, [Group_ID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json({ msg: "deleted", status: 200 });
    }
  });
};

statusgroup = async (req, res) => {
  const { User_Status, User_Email, Group_Id } = req.body;
  const sql =
    "UPDATE groupmembers SET User_Status =? WHERE User_Email = ? AND Group_ID = ?;";
  await con.query(
    sql,
    [User_Status, User_Email, Group_Id],
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

request = async (req, res) => {
  const { Status, User_Email, Group_Id } = req.body;
  const sql =
    "UPDATE `groupmembers` SET `User_Status`= ? WHERE Group_ID = ? AND User_Email = ?";
  await con.query(
    sql,
    [Status, Group_Id, User_Email],
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

getScoreCoor = async (req, res) => {
  const { Major, Academic_Year, Academic_Term } = req.body;
  // const major = req.body.Major;
  // const Projectonterm = req.body.Projectonterm;

  const sql =
    "SELECT st.User_Identity_ID,st.User_Name AS student,tea.User_Name AS Advisor,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=1 AND ass.Group_ID=gm.Group_ID) AS progress1,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=2 AND ass.Group_ID=gm.Group_ID) AS progress2,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=3 AND ass.Group_ID=gm.Group_ID) AS progress3,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=4 AND ass.Group_ID=gm.Group_ID) AS progress4,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=5 AND ass.Group_ID=gm.Group_ID) AS FinalPresentation,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=6 AND ass.Group_ID=gm.Group_ID) AS FinalDocumentation,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=7 AND ass.Group_ID=gm.Group_ID) AS Topic FROM users st,groupmembers gm, users tea WHERE st.Project_on_term_ID = (SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND gm.User_Email = st.User_Email AND st.User_Role = 1 AND tea.User_Email =(SELECT User_Email FROM groupmembers WHERE Group_Role = 0 AND Group_ID = (SELECT Group_ID FROM groupmembers WHERE User_Email = st.User_Email)) AND st.Major_ID = ?;";
  await con.query(
    sql,
    [Major, Academic_Year, Academic_Term],
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

getGroupScore = async (req, res) => {
  const Group_ID = req.body.Group_ID;

  const sql =
    "SELECT gmb.Group_Member_ID, usr.User_Email,usr.User_Identity_ID, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=1 AND ass.Group_ID=?) AS progress1, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=2 AND ass.Group_ID=?) AS progress2, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=3 AND ass.Group_ID=?) AS progress3, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=4 AND ass.Group_ID=?) AS progress4, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=5 AND ass.Group_ID=?) AS FinalPresentation, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=6 AND ass.Group_ID=?) AS FinalDocumentation, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=7 AND ass.Group_ID=?) AS Topic, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=8 AND ass.Group_ID=?) AS Groups , (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Group_ID=1) AS Total  FROM users usr INNER JOIN groupmembers gmb ON usr.User_Email = gmb.User_Email INNER JOIN groups gp ON gmb.Group_ID=gp.Group_ID WHERE gmb.Group_ID=? AND usr.Project_on_term_ID=gmb.Project_on_term_ID AND (gmb.Group_Role=2 OR gmb.Group_Role=3)";
  await con.query(
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
      Group_ID
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
listOwnGroup = async (req, res) => {
  console.log(req.body);
  const { User_Email, Year, Semester, Group_Role } = req.body;
  const sql =
    "SELECT Group_ID,Group_Name_Thai,Group_Name_Eng,Co_Advisor,(SELECT Major_Name FROM majors WHERE Major_ID = Major)AS Major,Group_Progression, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=0 ) AS Advisor, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=1 ) AS Committees,(SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND ( gmb.Group_Role=2 OR gmb.Group_Role=3) ) AS Students FROM (SELECT groups.Group_ID AS Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression,groupmembers.User_Email AS Members, groupmembers.User_Phone,groupmembers.Group_Role AS Roles FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND Group_Role=? AND User_Status = 1) AND groups.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND groups.Group_Status=1 ) AS subquery GROUP BY subquery.Group_ID";
  // const sql = 'SELECT groups.Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression ,groupmembers.Group_Member_ID,GROUP_CONCAT(  DISTINCT groupmembers.User_Email ORDER BY groupmembers.User_Email)AS Member,groupmembers.User_Phone,groupmembers.Group_Role FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =?) AND groups.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND groups.Group_Status=1 GROUP BY groups.Group_ID'
  // const sql =
  // "SELECT * FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND Group_Role=?) AND groups.Project_on_term_ID=?";
  await con.query(
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

listrequestGroup = async (req, res) => {
  console.log(req.body);
  const {
    User_Email,
    Project_on_term_ID,
    Group_Role,
    User_Status,
    Group_Role2
  } = req.body;
  const sql =
    "SELECT Group_ID,Group_Name_Thai,Group_Name_Eng,Co_Advisor,(SELECT Major_Name FROM majors WHERE Major_ID = Major)AS Major,Group_Progression, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=0 ) AS Advisor, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=1 ) AS Committees,(SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND ( gmb.Group_Role=2 OR gmb.Group_Role=3) ) AS Students FROM (SELECT groups.Group_ID AS Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression,groupmembers.User_Email AS Members, groupmembers.User_Phone,groupmembers.Group_Role AS Roles FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND (Group_Role=? OR Group_Role=?) AND User_Status = ?) AND groups.Project_on_term_ID=? AND groups.Group_Status=1 ) AS subquery GROUP BY subquery.Group_ID";
  // const sql = 'SELECT groups.Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression ,groupmembers.Group_Member_ID,GROUP_CONCAT(  DISTINCT groupmembers.User_Email ORDER BY groupmembers.User_Email)AS Member,groupmembers.User_Phone,groupmembers.Group_Role FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =?) AND groups.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND groups.Group_Status=1 GROUP BY groups.Group_ID'
  // const sql =
  // "SELECT * FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND Group_Role=?) AND groups.Project_on_term_ID=?";
  await con.query(
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

getMyGroup = async (req, res) => {
  const groupId = req.body.Group_ID;
  const sql =
    "SELECT gmb.Group_Member_ID, gp.Group_ID,gp.Major,gp.Project_on_term_ID,gp.Group_Name_Thai,gp.Group_Name_Eng,gp.Grade,gp.Final_Grade,gp.Comment_Grade,gp.Comment_FinalGrade,gp.Co_Advisor,usr.User_Name,gmb.Group_Role,usr.User_Email,usr.User_Identity_ID,gmb.User_Phone,gmb.User_Status FROM groups gp INNER JOIN groupmembers gmb ON gp.Group_ID=gmb.Group_ID INNER JOIN users usr ON gmb.User_Email=usr.User_Email AND gmb.Project_on_term_ID=usr.Project_on_term_ID WHERE gmb.Group_ID=? AND gmb.User_Status=1 ORDER BY gmb.Group_Member_ID";
  await con.query(sql, [groupId], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).json(result);
    }
  });
};

grading = async (req, res) => {
  // event 0 for update grad in group
  // event 1 for update final grad in group
  const { Group_ID, event, Grade, Comment } = req.body;

  const grade = "UPDATE `groups` SET `Grade` = ? WHERE `groups`.`Group_ID` = ?";
  const finalGrade =
    "UPDATE `groups` SET `Final_Grade` = ? WHERE `groups`.`Group_ID` = ?";

  const commentGrade =
    "UPDATE `groups` SET `Comment_Grade` = ? WHERE `groups`.`Group_ID` = ?";

  const commentFinalGrade =
    "UPDATE `groups` SET `Comment_FinalGrade` = ? WHERE `groups`.`Group_ID` = ?";

  await con.query(
    event == 0 ? grade : finalGrade,
    [Grade, Group_ID],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "Internal Server Error", status: 500 });
      } else {
        con.query(
          event == 0 ? commentGrade : commentFinalGrade,
          [Comment, Group_ID],
          (err, result, fields) => {
            if (err) {
              console.log(err);
              res
                .status(500)
                .json({ msg: "Internal Server Error", status: 500 });
            } else {
              res.status(200).json({ msg: "graded", status: 200 });
            }
          }
        );

        // res.status(200).json({ msg: 'graded', status: 200 })
      }
    }
  );
};

module.exports = {
  getAll,
  getGroupWithID,
  getGroupInfo,
  getGroupMembers,
  getTeachersWithGroupID,
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
  request,
  getMyGroup,
  grading,
  deleteById
};
