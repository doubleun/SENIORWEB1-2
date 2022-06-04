const { result } = require('lodash')
const con = require('../config/db')
const conPromise = con.promise()
const { createErrorJSON } = require('../utility')

createGroup = async (req, res) => {
  let {
    Group_Name_Thai,
    Group_Name_Eng,
    Co_Advisor,
    Major,
    Group_ID,
    student,
    advisor,
    committee,
    deletedMember,
    groupCreated
  } = req.body

  try {
    // begin transaction
    await conPromise.beginTransaction((err) => {
      if (err) throw err
    })

    // =========== check user have group =============
    // spcial task * check student already have group or not

    // if (!groupCreated) {
    console.log('case not create')
    const checkExistUser =
      'SELECT User_Email FROM groupmembers WHERE User_Email IN (?) AND Project_on_term_ID = ?'

    let studentEmail = student.map((el) => el.User_Email)

    const duplicateUser = await conPromise.query(
      checkExistUser,
      [studentEmail, req.user.projectOnTerm],
      (err) => {
        if (err) {
          throw err
        }
      }
    )

    if (duplicateUser[0].length !== 0) {
      res.status(400).json(
        createErrorJSON({
          msg: `${duplicateUser[0]
            .map((el) => el.User_Email)
            .join(',')} is/are already have groups`,
          errDialog: { enabled: true, redirect: false }
        })
      )
      return
    }
    // }

    let member = [...student, ...advisor, ...committee]

    // ======== task1: create group ==========

    // case create group
    const createGroup =
      'INSERT INTO groups (Group_Name_Thai,Group_Name_Eng,Co_Advisor,Major,Project_on_term_ID) VALUES (?,?,?,?,?);'

    // case update group
    const updateGroup =
      'UPDATE `groups` SET `Group_Name_Thai` = ?, `Group_Name_Eng` = ?, `Co_Advisor` = ? WHERE Group_ID = ?'

    const groupId = await conPromise.execute(
      !groupCreated ? createGroup : updateGroup,
      !groupCreated
        ? [
            Group_Name_Thai,
            Group_Name_Eng,
            Co_Advisor,
            Major,
            req.user.projectOnTerm
          ]
        : [Group_Name_Thai, Group_Name_Eng, Co_Advisor, Group_ID],
      (err) => {
        if (err) throw err
      }
    )

    if (!groupCreated) {
      Group_ID = groupId[0].insertId
    }

    // throw if don't have group id
    if (!Group_ID && !groupCreated) {
      throw 'No group id'
    }

    // map group id then insert member
    member = member.map((el) => [
      el.User_Email,
      el.User_Status ? el.User_Status : 0,
      el.User_Phone,
      el.Group_Role,
      Group_ID,
      req.user.projectOnTerm
    ])

    // ========= task2: add member =============
    const insetrMember =
      'INSERT IGNORE INTO groupmembers ( User_Email, User_Status, User_Phone, Group_Role, Group_ID, Project_on_term_ID ) VALUES ? ON DUPLICATE KEY UPDATE  User_Status = VALUES(User_Status), User_Phone = VALUES(User_Phone)'

    // excute method can not insert with array
    await conPromise.query(insetrMember, [member], (err) => {
      if (err) throw err
    })

    // task3: delete member out
    if (deletedMember.length !== 0) {
      console.log('deletedMember', deletedMember)
      // const memberLeft =
      //   'UPDATE groupmembers SET User_Status = 2 WHERE Group_Member_ID IN (?)'
      const memberLeft = 'DELETE FROM groupmembers WHERE Group_Member_ID IN (?)'

      await conPromise.query(memberLeft, [deletedMember], (err) => {
        if (err) throw err
      })
    }

    // commit all task
    await conPromise.commit()
    res.status(200).json({ msg: 'Create group successfully', status: 200 })
  } catch (error) {
    console.log(error)
    conPromise.rollback()
    // res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    res.status(500).json(
      createErrorJSON({
        msg: !groupCreated ? 'Create group fail' : 'Update group fail',
        errDialog: { enabled: true, redirect: false }
      })
    )
  }
}

// Get group based on ID (for my advisee, comittee pages)
getGroupWithID = async (req, res) => {
  // const { Group_ID, Email, Project_on_term_ID } = req.body;
  const { Group_ID, Email } = req.body

  try {
    // 1.) Select query for group members
    const sqlGroupMembers =
      'SELECT u.User_Email, u.User_Identity_ID, u.User_Name, u.User_Role, gm.Group_Role, gm.User_Status, gm.User_Phone FROM `groupmembers` gm INNER JOIN `users` u ON gm.User_Email = u.User_Email WHERE gm.Group_ID = ? AND gm.User_Status = 1 AND gm.Project_on_term_ID = ? ORDER BY gm.Group_Role DESC'
    // Group members result
    // First element in the returned array is 'row', the second is 'field'
    const [groupMembers] = await con
      .promise()
      .query(sqlGroupMembers, [Group_ID, req.user.projectOnTerm], (err) => {
        if (err) throw err
      })

    // Check if the person is a member or not first, if not return failed to fetch
    if (!groupMembers.map((member) => member.User_Email).includes(Email))
      throw new Error('Not a member of this group')

    // 2.) Select query for group info
    const sqlGroupInfo =
      'SELECT g.Group_ID, g.Group_Name_Thai, g.Group_Name_Eng, g.Co_Advisor, g.Major, g.Group_Status, g.Group_Progression, g.Project_on_term_ID, g.Grade, g.Is_Re_Eval, g.Received_New_Grade, gm.Group_Role AS `Current_Member_Role`, gm.Group_Member_ID AS `Current_Member_ID` FROM `groups` g INNER JOIN `groupmembers` gm ON g.Group_ID = gm.Group_ID WHERE gm.User_Email = ? AND g.Group_ID = ?'
    // Group info result
    con.query(sqlGroupInfo, [Email, Group_ID], (err, groupInfo) => {
      if (err) throw err
      res.status(200).json({ groupInfo, groupMembers, status: 200 })
      return
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: err, status: 500 })
    return
  }
}

// Get current user group info if the student has one
getGroupInfo = (req, res) => {
  // const { User_Email, Project_on_term_ID } = req.body;
  // const { User_Email } = req.body;
  const sql =
    'SELECT gm.Group_Member_ID, gm.User_Phone, gm.Group_Role, gm.Group_ID, gm.User_Status, g.Major, g.Group_Name_Thai, g.Group_Name_Eng, g.Co_Advisor, g.Group_Status, g.Group_Progression, g.Grade, g.Is_Re_Eval, g.Received_New_Grade, g.Project_on_term_ID FROM `groupmembers` gm INNER JOIN `groups` g ON gm.Group_ID = g.Group_ID WHERE gm.User_Email = ? AND gm.Project_on_term_ID = ? AND NOT gm.User_Status = 2 AND NOT g.Group_Status = 0'
  con.query(
    sql,
    [req.user.email, req.user.projectOnTerm],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        res.status(200).json(result)
      }
    }
  )
}

// Get current user group info if the student has one
getGroupMajor = (req, res) => {
  const { Group_ID } = req.body
  const sql =
    'SELECT DISTINCT Major_ID, Major_Name FROM `majors` WHERE `Major_ID` IN (SELECT `Major_ID` FROM `users` WHERE `User_Email` IN (SELECT `User_Email` FROM `groupmembers` WHERE `Group_ID`= ? AND `User_Status` !=2 AND (`Group_Role` = 3 or `Group_Role` = 2)))'
  con.query(sql, [Group_ID], (err, result, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.status(200).json(result)
    }
  })
}
// Get group members for filling in the create group page form
getGroupMembers = (req, res) => {
  const { Group_ID } = req.body
  const sql =
    'SELECT gm.Group_Member_ID, u.User_Email, u.User_Identity_ID, u.User_Name, u.User_Role, gm.Group_Role, gm.User_Phone, gm.User_Status FROM `groupmembers` gm INNER JOIN `users` u ON gm.User_Email = u.User_Email AND gm.Project_on_term_ID = u.Project_on_term_ID WHERE gm.Group_ID = ? AND NOT gm.User_Status = 2 ORDER BY gm.Group_Role DESC'
  con.query(sql, [Group_ID], (err, result, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.status(200).json(result)
    }
  })
}

// Get group based on project on term (ie. academic year and semester)
getAllGroupsAdmin = (req, res) => {
  const { Year, Semester, Major, Senior } = req.body
  const sql =
    'SELECT gp.Group_ID, gp.Group_Name_Thai, gp.Group_Name_Eng, gp.Co_Advisor, gp.Group_Status, (SELECT Major_Name FROM majors WHERE Major_ID = ?)AS Major_Name,(SELECT Major_ID FROM majors WHERE Major_ID = ?)AS Major_ID, (SELECT users.User_Name FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email AND users.Project_on_term_ID = gm.Project_on_term_ID WHERE gm.Group_Role = 0 AND gm.User_Status = 1 AND gm.Group_ID=gp.Group_ID) AS Advisor, (SELECT GROUP_CONCAT(User_Name) FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email AND users.Project_on_term_ID = gm.Project_on_term_ID WHERE gm.User_Status = 1 AND (gm.Group_Role = 2 OR gm.Group_Role = 3) AND gm.Group_ID=gp.Group_ID) AS Students, (SELECT GROUP_CONCAT(User_Name) FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email WHERE gm.Group_Role = 1 AND gm.User_Status = 1 AND gm.Group_ID=gp.Group_ID) AS Committee, gp.Project_on_term_ID FROM `groups` gp WHERE Project_on_term_ID = (SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year = ? AND Academic_Term = ? AND Senior = ?) AND Major = ? AND Group_Status = 1'
  con.query(
    sql,
    [Major, Major, Year, Semester, Senior, Major],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        res.status(200).json(result)
      }
    }
  )
}

getGroupsFinalDoc = (req, res) => {
  const { Academic_Year, Academic_Term, Senior } = req.body
  const sql =
    "SELECT gp.Group_ID, gp.Group_Name_Thai, gp.Group_Name_Eng, gp.Co_Advisor, gp.Group_Status, (SELECT Major_Name from majors WHERE Major_ID=gp.Major)AS Major_Name, gp.Major as Major_ID, gp.Grade,(SELECT users.User_Name FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email AND users.Project_on_term_ID = gm.Project_on_term_ID WHERE gm.Group_Role = 0 AND gm.User_Status = 1 AND gm.Group_ID=gp.Group_ID) AS Advisor, (SELECT GROUP_CONCAT(User_Name) FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email WHERE gm.User_Status = 1 AND (gm.Group_Role = 2 OR gm.Group_Role = 3 AND gm.Group_ID=gp.Group_ID)) AS Students, (SELECT GROUP_CONCAT(User_Name) FROM users INNER JOIN groupmembers gm ON users.User_Email = gm.User_Email WHERE gm.Group_Role = 1 AND gm.User_Status = 1 AND gm.Group_ID=gp.Group_ID) AS Committee, gp.Project_on_term_ID FROM `groups` gp WHERE Project_on_term_ID = (SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year = ? AND Academic_Term = ? AND Senior = ? ) AND Group_Status = 1 AND gp.Grade!='U' AND gp.Grade!='F' AND gp.Grade!='I' AND gp.Grade!='P'"
  con.query(
    sql,
    [Academic_Year, Academic_Term, Senior],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        res.status(200).json(result)
      }
    }
  )
}

// Get teachers with score on each progress, using group id
getTeachersWithGroupID = (req, res) => {
  // const { Group_ID, Progress_ID, Project_on_term_ID } = req.body;
  const { Group_ID, Progress_ID } = req.body
  const getTeachersProgressSql =
    'SELECT gm.Group_Member_ID, gm.User_Email, gm.Group_Role, sc.Score, sc.Max_Score, sc.Comment, (SELECT `User_Name` FROM `users` WHERE `User_Email` = gm.User_Email) AS `User_Name` FROM `groupmembers` gm LEFT JOIN `scores` sc ON sc.Group_Member_ID = gm.Group_Member_ID WHERE gm.Group_ID = ? AND sc.Assignment_ID = (SELECT `Assignment_ID` FROM `assignments` WHERE `Progress_ID` = ? AND `Group_ID` = ?) AND gm.Project_on_term_ID = ? AND gm.Group_Role IN (0,1)'
  try {
    con.query(
      getTeachersProgressSql,
      [Group_ID, Progress_ID, Group_ID, req.user.projectOnTerm],
      (err, result, fields) => {
        if (err) throw err
        res.status(200).json({
          advisor: result.filter((teacher) => teacher.Group_Role === 0)[0],
          committees: result.filter((teacher) => teacher.Group_Role === 1)
        })
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
    return
  }
}

// Get eval comment of advisor and 2 committees (for eval page)
// This could be all teachers(use in student side) or only one(use in teacher side)
getTeachersEval = (req, res) => {
  const {
    Email,
    Group_ID,
    Single,
    Group_Info,
    reEvalComment,
    filterTeachersRole = false
  } = req.body
  try {
    // Check if 'Single' is true, if it is then query for single teacher eval comment using email
    const getTeachersEval = `SELECT ec.Comment, ec.File_Name, gm.Group_Role, gm.Group_Member_ID, u.User_Name FROM groupmembers gm INNER JOIN evalcomment ec ON gm.Group_Member_ID = ec.Group_Member_ID INNER JOIN users u ON gm.User_Email = u.User_Email WHERE ${
      Single ? 'gm.User_Email = ? AND' : ''
    } ec.Group_ID = ? ${
      reEvalComment ? 'AND ec.Re_Eval = 1' : 'AND ec.Re_Eval = 0'
    }`
    // console.log("GetTeachersEvalSQL: ", getTeachersEval);

    // 1.) Select eval comment(s)
    // Here rest parameter syntax is used for conditionally spread element in the array
    con.query(
      getTeachersEval,
      [...(Single ? [Email] : []), Group_ID],
      (err, evalResult) => {
        if (err) throw err
        console.log('Eval result: ', evalResult)

        // 2.) In some case, group info may also needed (for getting the grade) If it's needed, query for group info next
        // This query includes 'Current_Member_Role' and 'Current_Member_ID'
        if (Group_Info) {
          const getGroupWithId =
            'SELECT g.Group_ID, g.Group_Name_Thai, g.Group_Name_Eng, g.Co_Advisor, g.Major, g.Group_Status, g.Group_Progression, g.Project_on_term_ID, g.Grade, g.Is_Re_Eval, g.Received_New_Grade, gm.Group_Role AS `Current_Member_Role`, gm.Group_Member_ID AS `Current_Member_ID` FROM `groups` g INNER JOIN `groupmembers` gm ON g.Group_ID = gm.Group_ID WHERE gm.User_Email = ? AND g.Group_ID = ?'
          con.query(getGroupWithId, [Email, Group_ID], (err, groupResult) => {
            if (err) throw err
            console.log('Group info result: ', groupResult)
            res.status(200).json({ eval: evalResult, group: groupResult[0] })
          })
        } else {
          // If the filterTeachersRole flag is true, then filter teachers based on their role
          const data = filterTeachersRole
            ? {
                advisor: evalResult.filter(
                  (teacher) => teacher.Group_Role === 0
                )[0],
                committees: evalResult.filter(
                  (teacher) => teacher.Group_Role === 1
                )
              }
            : { eval: evalResult }
          // If no request for group info then only response with evalResult
          res.status(200).json(data)
          return
        }
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
    return
  }
}

// get all group
// TODO: get by major
getByMajor = (req, res) => {
  const major = req.body.Major

  const sql = 'SELECT * FROM `groups` WHERE Major = ?'
  con.query(sql, [major], (err, result, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.status(200).json(result)
    }
  })
}

getByRole = (req, res) => {
  const Email = req.body.Email

  const sql =
    'SELECT COUNT(Group_Member_ID) AS commitee,(SELECT COUNT(Group_Member_ID) FROM `groupmembers` WHERE User_Email = ? AND Group_Role = 0) AS advicee FROM `groupmembers` WHERE User_Email = ? AND Group_Role = 1;'
  con.query(sql, [Email, Email], (err, result, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.status(200).json(result)
    }
  })
}

deletes = (req, res) => {
  // const groupId = req.body.Group_ID;
  // const sql = "UPDATE `groups` SET `Group_Status` = 0 WHERE `Group_ID` = ?;";
  const { data } = req.body
  const sql =
    'INSERT INTO `groups`(`Group_ID`, `Group_Status`) VALUES ? ON DUPLICATE KEY UPDATE Group_Status=VALUES(Group_Status)'
  con.query(
    sql,
    [data.map((itm) => Object.values(itm))],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        const deleteIDs = data.map((itm) => itm.Group_ID)
        res.status(200).json({ msg: 'sucess', status: 200, result: deleteIDs })
      }
    }
  )
}

// delete by id for advisor
deleteById = (req, res) => {
  const Group_ID = req.body.Group_ID
  const sql = 'UPDATE `groups` SET `Group_Status` = 0 WHERE `Group_ID` = ?'
  con.query(sql, [Group_ID], (err, result, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.status(200).json({ msg: 'deleted', status: 200 })
    }
  })
}

getOnlyGroupWithID = (req, res) => {
  const { Group_ID } = req.body
  const getOnlyGroup = 'SELECT * FROM `groups` WHERE `Group_ID` = ?'
  try {
    con.query(getOnlyGroup, [Group_ID], (err, result) => {
      if (err) throw err
      res.status(200).json(result[0])
      return
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: err, status: 500 })
    return
  }
}

statusgroup = (req, res) => {
  const { User_Status, User_Email, Group_Id } = req.body
  const sql =
    'UPDATE groupmembers SET User_Status =? WHERE User_Email = ? AND Group_ID = ?;'
  con.query(sql, [User_Status, User_Email, Group_Id], (err, result, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.status(200).json(result)
    }
  })
}

// Use for update group member status after user accept or decline group invitation
/**
 * @param Status - status = 1 is join, status = 2 is left
 */
updateMemberStatus = async (req, res) => {
  const { Status, Group_Id, Major, User_Email } = req.body
  // console.log(Status, User_Email, Group_Id, Major)
  // const updateStatus =
  //   'UPDATE `groupmembers` SET `User_Status`= ? WHERE Group_ID = ? AND User_Email = ?'
  // const memberJoin =
  //   'UPDATE `groupmembers` SET `User_Status`= 1 WHERE Group_Member_ID = ?'
  const memberJoin =
    'UPDATE `groupmembers` SET `User_Status`= 1 WHERE Group_ID = ? AND User_Email = ?'
  const memberLeft =
    'DELETE FROM groupmembers WHERE Group_ID = ? AND User_Email = ?'
  const updateGroup = 'UPDATE `groups` SET `Major`= ? WHERE `Group_ID` = ?;'
  try {
    await conPromise.beginTransaction((err) => {
      if (err) throw err
    })

    // ========== task 1: update group member status ============
    await conPromise.query(
      Status === 1 ? memberJoin : memberLeft,
      [Group_Id, User_Email],
      (err) => {
        if (err) throw err
      }
    )

    // ========== task 2: update group major ============

    if (Major !== '' && Major !== null && Status === 1) {
      con.query(updateGroup, [Major, Group_Id], (err) => {
        if (err) throw err
      })
    }

    await conPromise.commit()
    res.status(200).json({ msg: 'Success', status: 200 })
  } catch (err) {
    console.log(err)
    conPromise.rollback()
    res.status(500).json(
      createErrorJSON({
        msg: 'Join group fail',
        errDialog: { enabled: true, redirect: false }
      })
    )
  }
}

getScoreCoor = (req, res) => {
  const { Major, Academic_Year, Academic_Term } = req.body
  console.log(req.body)
  const { senior } = req.user
  // const major = req.body.Major;
  console.log('senior', senior)
  // const Projectonterm = req.body.Projectonterm;\
  const sql =
    'SELECT usr.User_Identity_ID as Id, usr.User_Name AS Name,(SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=2 AND ass.Group_ID=gmb.Group_ID) AS Proposal, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=3 AND ass.Group_ID=gmb.Group_ID) AS Progress1, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=4 AND ass.Group_ID=gmb.Group_ID) AS Progress2, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=5 AND ass.Group_ID=gmb.Group_ID) AS Progress3, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=6 AND ass.Group_ID=gmb.Group_ID) AS Progress4,  (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=7 AND ass.Group_ID=gmb.Group_ID) AS FinalPresentation, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=8 AND ass.Group_ID=gmb.Group_ID) AS FinalDocumentation, (SELECT Grade FROM groups WHERE Group_ID = gmb.Group_ID )AS Grade FROM users usr INNER JOIN groupmembers gmb  ON usr.User_Email = gmb.User_Email AND usr.Project_on_term_ID = gmb.Project_on_term_ID WHERE gmb.Project_on_term_ID= (SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=? AND Senior=?) AND (gmb.Group_Role=3 OR gmb.Group_Role=2) AND usr.Major_ID=?'
  con.query(
    sql,
    [Academic_Year, Academic_Term, senior, Major],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
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
              Grade: grade
            }
          )
        )

        res.status(200).json(result)
      }
    }
  )
}

getGroupScore = (req, res) => {
  const Group_ID = req.body.Group_ID

  const sql =
    'SELECT gmb.Group_Member_ID, usr.User_Email,usr.User_Identity_ID, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=1 AND ass.Group_ID=?) AS progress1, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=2 AND ass.Group_ID=?) AS progress2, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=3 AND ass.Group_ID=?) AS progress3, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=4 AND ass.Group_ID=?) AS progress4, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=5 AND ass.Group_ID=?) AS FinalPresentation, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=6 AND ass.Group_ID=?) AS FinalDocumentation, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=7 AND ass.Group_ID=?) AS Topic, (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Progress_ID=8 AND ass.Group_ID=?) AS Groups , (SELECT SUM( sc.Score) FROM scores sc INNER JOIN assignments ass ON sc.Assignment_ID=ass.Assignment_ID WHERE ass.Group_ID=?) AS Total  FROM users usr INNER JOIN groupmembers gmb ON usr.User_Email = gmb.User_Email INNER JOIN groups gp ON gmb.Group_ID=gp.Group_ID WHERE gmb.Group_ID=? AND usr.Project_on_term_ID=gmb.Project_on_term_ID AND (gmb.Group_Role=2 OR gmb.Group_Role=3)'
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
      Group_ID
    ],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        res.status(200).json(result)
      }
    }
  )
}

// list group that teacher are advisor or committee
listOwnGroup = (req, res) => {
  // console.log(req.body);
  const { Group_Role } = req.body
  const { email, academicYear, semester, senior } = req.user
  const sql =
    'SELECT Group_ID,Group_Name_Thai,Group_Name_Eng,Co_Advisor,(SELECT Major_Name FROM majors WHERE Major_ID = Major)AS Major,Group_Progression, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=0 ) AS Advisor, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=1 ) AS Committees,(SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND ( gmb.Group_Role=2 OR gmb.Group_Role=3) ) AS Students FROM (SELECT groups.Group_ID AS Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression,groupmembers.User_Email AS Members, groupmembers.User_Phone,groupmembers.Group_Role AS Roles FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND Group_Role=? AND User_Status = 1) AND groups.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=? AND Senior=?) AND groups.Group_Status=1 ) AS subquery GROUP BY subquery.Group_ID'
  // const sql = 'SELECT groups.Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression ,groupmembers.Group_Member_ID,GROUP_CONCAT(  DISTINCT groupmembers.User_Email ORDER BY groupmembers.User_Email)AS Member,groupmembers.User_Phone,groupmembers.Group_Role FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =?) AND groups.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND groups.Group_Status=1 GROUP BY groups.Group_ID'
  // const sql =
  // "SELECT * FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND Group_Role=?) AND groups.Project_on_term_ID=?";
  con.query(
    sql,
    [email, Group_Role, academicYear, semester, senior],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        res.status(200).json(result)
      }
    }
  )
}

listrequestGroup = (req, res) => {
  console.log(req.body)
  // const {
  //   User_Email,
  //   Project_on_term_ID,
  //   Group_Role,
  //   User_Status,
  //   Group_Role2,
  // } = req.body;
  const { User_Email, Group_Role, User_Status, Group_Role2 } = req.body
  const sql =
    'SELECT Group_ID,Group_Name_Thai,Group_Name_Eng,Co_Advisor,(SELECT Major_Name FROM majors WHERE Major_ID = Major)AS Major,Group_Progression, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=0 ) AS Advisor, (SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND gmb.Group_Role=1 ) AS Committees,(SELECT GROUP_CONCAT(usr.User_Name) FROM groupmembers gmb INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gmb.Group_ID = subquery.Group_ID AND ( gmb.Group_Role=2 OR gmb.Group_Role=3) ) AS Students FROM (SELECT groups.Group_ID AS Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression,groupmembers.User_Email AS Members, groupmembers.User_Phone,groupmembers.Group_Role AS Roles FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND (Group_Role=? OR Group_Role=?) AND User_Status = ?) AND groups.Project_on_term_ID=? AND groups.Group_Status=1 ) AS subquery GROUP BY subquery.Group_ID'
  // const sql = 'SELECT groups.Group_ID, groups.Group_Name_Thai,groups.Group_Name_Eng,groups.Co_Advisor,groups.Major,groups.Group_Progression ,groupmembers.Group_Member_ID,GROUP_CONCAT(  DISTINCT groupmembers.User_Email ORDER BY groupmembers.User_Email)AS Member,groupmembers.User_Phone,groupmembers.Group_Role FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =?) AND groups.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=?) AND groups.Group_Status=1 GROUP BY groups.Group_ID'
  // const sql =
  // "SELECT * FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =? AND Group_Role=?) AND groups.Project_on_term_ID=?";
  con.query(
    sql,
    [User_Email, Group_Role, Group_Role2, User_Status, req.user.projectOnTerm],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        res.status(200).json(result)
      }
    }
  )
}

getMyGroup = (req, res) => {
  const groupId = req.body.Group_ID
  const sql =
    'SELECT gmb.Group_Member_ID, gp.Group_ID,gp.Major,gp.Project_on_term_ID,gp.Group_Name_Thai,gp.Group_Name_Eng,gp.Grade,gp.Is_Re_Eval,gp.Co_Advisor,usr.User_Name,gmb.Group_Role,usr.User_Email,usr.User_Identity_ID,gmb.User_Phone,gmb.User_Status FROM groups gp INNER JOIN groupmembers gmb ON gp.Group_ID=gmb.Group_ID INNER JOIN users usr ON gmb.User_Email=usr.User_Email AND gmb.Project_on_term_ID=usr.Project_on_term_ID WHERE gmb.Group_ID=? AND gmb.User_Status=1 ORDER BY gmb.Group_Member_ID'
  con.query(sql, [groupId], (err, result, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.status(200).json(result)
    }
  })
}

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
    Assignment_ID
  } = req.body

  // If there is a file (re-eval grading) then create variable of the file name
  let fileName = ''
  if (!!req.file) {
    fileName = req.file.filename
  }
  // console.log("=========== DEBUG ==============");

  try {
    // Begin transaction
    await conPromise.beginTransaction((err) => {
      if (err) throw err
    })
    // 1.) Insert comment in 'evalcomment' table
    const insertEvalComment = `INSERT INTO evalcomment(Comment, File_Name, Group_Member_ID, Group_ID${
      reEvalComment ? ', Re_Eval' : ''
    }) VALUES (?, ?, ?, ?${reEvalComment ? ', 1' : ''})`
    await conPromise.execute(
      insertEvalComment,
      [Comment, fileName, Group_Member_ID, Group_ID],
      (err) => {
        if (err) throw err
      }
    )

    // 2.) If is advisor, then update grade in 'groups' table
    if (isAdvisor && Grade) {
      // isReEval indicate that advisor gave an "I"
      const updateGrade = `UPDATE groups SET Grade = ?, Is_Re_Eval = ${
        isReEval ? 1 : 0
      }, Received_New_Grade = ${newEvalScore ? 1 : 0} ${
        isReEval ? ', Group_Progression = 10' : ''
      } WHERE groups.Group_ID = ?`
      await conPromise.execute(updateGrade, [Grade, Group_ID], (err) => {
        if (err) throw err
      })
    }

    // If there is a file
    // TODO: Also check if this is re -eval grading ?
    if (!!req.file && !!Assignment_ID) {
      // 3.) Insert files into database
      const filesSql =
        'INSERT INTO files(File_Name, Path, Type, Assignment_ID, Group_Member_ID) VALUES (?, ?, ?, ?, ?)'
      await conPromise.execute(
        filesSql,
        [
          req.file.filename,
          req.file.path,
          'File',
          Assignment_ID,
          Group_Member_ID
        ],
        (err, result) => {
          if (err) throw err
        }
      )
    }

    // Commit
    await conPromise.commit()
    res.status(200).json({ msg: 'Insert successfully', status: 200 })
    return
  } catch (err) {
    console.log(err)
    conPromise.rollback()
    console.log('Rollback successfully')
    res.status(500).json({ msg: 'Interal Server Error', status: 500 })
    return
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
}

countTeachergroup = (req, res) => {
  // count amount of my group and group request
  // const { User_Email, Project_on_term_ID } = req.body;
  const { User_Email } = req.body
  const sql =
    'SELECT ( SELECT COUNT(*) FROM groups gp INNER JOIN groupmembers gmb ON gp.Group_ID=gmb.Group_ID WHERE gmb.User_Email=? AND gmb.Project_on_term_ID=? AND gmb.Group_Role=0 AND gmb.User_Status=1 AND gp.Group_Status!=0) AS Advisor, ( SELECT COUNT(*) FROM groups gp INNER JOIN groupmembers gmb ON gp.Group_ID=gmb.Group_ID WHERE gmb.User_Email=? AND gmb.Project_on_term_ID=? AND gmb.Group_Role=1 AND gmb.User_Status=1 AND gp.Group_Status!=0) AS Committee, ( SELECT COUNT(*) FROM groups gp INNER JOIN groupmembers gmb ON gp.Group_ID=gmb.Group_ID WHERE gmb.User_Email=? AND gmb.Project_on_term_ID=? AND gmb.User_Status=0) AS GroupRequest'
  con.query(
    sql,
    [
      User_Email,
      req.user.projectOnTerm,
      User_Email,
      req.user.projectOnTerm,
      User_Email,
      req.user.projectOnTerm
    ],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        res.status(200).json(result)
      }
    }
  )
}

countProgressGroup = (req, res) => {
  // count amount of my group and group request
  // const { Project_on_term_ID } = req.body;
  const sql =
    'SELECT COUNT(Major_ID) as numberPro , Major_ID FROM `scorecriterias` WHERE Project_on_term_ID = ? GROUP BY Major_ID ORDER BY numberPro DESC'
  con.query(sql, [req.user.projectOnTerm], (err, result, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.status(200).json(result)
    }
  })
}

getAllFilesMajor = (req, res) => {
  const { Academic_Year, Academic_Term, Major } = req.body
  // console.log(req.body);
  const { senior } = req.user

  const sql =
    'SELECT  `File_Name` AS fileName, `Path` AS path, `Type` AS type,(SELECT `Submit_Date` FROM `assignments` WHERE `Assignment_ID` = files.Assignment_ID) AS submitDate, (SELECT  `Group_Name_Eng` FROM `groups` WHERE `Group_ID` =(SELECT `Group_ID` FROM groupmembers WHERE Group_Member_ID = files.Group_Member_ID)) AS groupName FROM `files` WHERE Assignment_ID IN (SELECT `Assignment_ID` FROM `assignments` WHERE Group_ID IN (SELECT DISTINCT Group_ID FROM groupmembers WHERE User_Email IN (SELECT `User_Email` FROM `users` WHERE Project_on_term_ID =(SELECT Project_on_term_ID FROM `projectonterm` WHERE Academic_Year=? AND Academic_Term=? AND Senior=?) AND `Major_ID` = ?)))'

  con.query(
    sql,
    [Academic_Year, Academic_Term, senior, Major],
    (err, result, fields) => {
      if (err) {
        res.status(422).json({ msg: 'Query Error', status: 422 })
      } else {
        res.status(200).json(result)
      }
    }
  )
}

getAllFinalDoc = (req, res) => {
  // console.log(req.body);

  const finalDco =
    'SELECT gp.Group_ID, gp.Group_Name_Eng,gp.Group_Name_Thai, fl.File_Name,fl.Path,ass.Submit_Date,fl.Type, ass.Assignment_ID FROM files fl INNER JOIN assignments ass ON fl.Assignment_ID=ass.Assignment_ID INNER JOIN groups gp ON ass.Group_ID=gp.Group_ID WHERE ass.Progress_ID = IF(gp.Is_Re_Eval=0, 8 , 10)'

  con.query(finalDco, (err, result, fields) => {
    if (err) {
      res.status(500).json({ msg: 'Interal error', status: 500 })
    } else {
      res.status(200).json(result)
    }
  })
}

// TODO: Check if affected row (when move group and insert memeber is zero)
moveGroup = async (req, res) => {
  // const projectOnTerm = req.body.Project_on_term_ID
  let { Academic_Year, Semester } = req.body

  // get project on term id
  const getProjectOnTermId =
    'SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year = ? AND Academic_Term = ? AND Senior = ?'

  // move group
  const moveGroup =
    "INSERT INTO groups ( Group_Name_Thai,Group_Name_Eng,Co_Advisor,Major,Project_on_term_ID) SELECT Group_Name_Thai,Group_Name_Eng,Co_Advisor,Major,? FROM groups WHERE Project_on_term_ID = ? AND Grade NOT IN('I','U','F')"

  // move groupmember
  const moveGroupmember =
    "INSERT IGNORE INTO `groupmembers`( `User_Email`, `User_Phone`, `Group_Role`, `User_Status`, `Group_ID`, `Project_on_term_ID`) SELECT gmb.User_Email, gmb.User_Phone, gmb.Group_Role, IF(gmb.Group_Role=3, 1, 0), (SELECT MAX(Group_ID) FROM groups WHERE Group_Name_Eng = gp.Group_Name_Eng AND Group_Name_Thai=gp.Group_Name_Thai AND Co_Advisor = gp.Co_Advisor AND Major = gp.Major) AS newGroupID, ? FROM groupmembers gmb INNER JOIN groups gp ON gmb.Group_ID = gp.Group_ID INNER JOIN users usr ON gmb.User_Email=usr.User_Email WHERE gp.Grade NOT IN('I','U','F') AND gp.Group_Status=1 AND usr.Project_on_term_ID = ?"

  try {
    // begin transaction
    await conPromise.beginTransaction((err) => {
      if (err) throw err
    })

    // task 1 fetch project on term ids and verify
    // current project on term id
    let currentProjectOnTerm = await conPromise.query(
      getProjectOnTermId,
      [Academic_Year, Semester, 2],
      (err) => {
        if (err) {
          throw err
        }
      }
    )

    if (currentProjectOnTerm[0].length === 0) {
      throw new Error('Cannot find the current semester in the database')
    }

    const [{ Project_on_term_ID: currentId }] = currentProjectOnTerm[0]

    // if it's semester 1 then go back 1 semester
    if (Semester - 1 === 0) {
      Academic_Year = Academic_Year - 1
      Semester = Semester + 1
    } else {
      Semester = Semester - 1
    }

    // previous project on term id
    console.log(Academic_Year, Semester)
    const prevProjectOnTerm = await conPromise.query(
      getProjectOnTermId,
      [Academic_Year, Semester, 1],
      (err) => {
        if (err) {
          throw err
        }
      }
    )
    console.log('prevProjectOnTerm[0]', prevProjectOnTerm[0].length)
    // check if previous project on term exists
    if (prevProjectOnTerm[0].length === 0) {
      throw new Error(
        `Cannot find previous semester, please check if ${Semester}/${Academic_Year} exists`
      )
    }

    const [{ Project_on_term_ID: previousId }] = prevProjectOnTerm[0]

    console.log(currentId, previousId)

    // task 2 move group
    await conPromise.query(moveGroup, [currentId, previousId], (err) => {
      if (err) {
        throw err
      }
    })

    console.log('=============== group inserted ===============')

    // task 3 move groupmember
    let [{ affectedRows: moveGroupResult }] = await conPromise.query(
      moveGroupmember,
      [currentId, currentId],
      (err) => {
        if (err) {
          throw err
        }
      }
    )

    console.log('=============== members inserted ===============')

    // commit all task
    await conPromise.commit()
    if (moveGroupResult === 0) {
      res
        .status(200)
        .json({ msg: 'Move group successfully with 0 user', status: 200 })
    } else {
      res.status(200).json({ msg: 'Move group successfully', status: 200 })
    }
  } catch (error) {
    console.log('Error log:', error)
    conPromise.rollback()
    res.status(500).json(
      createErrorJSON({
        msg: String(error),
        errDialog: { enabled: true, redirect: false }
      })
    )
  }
}

countOwnGroup = (req, res) => {
  // count group that is advisor or committee
  const { Academic_Year, Academic_Term, Senior } = req.body
  // console.log(req.body);

  const countGroup =
    'SELECT subquery.User_Email,subquery.User_Name,(SELECT COUNT(Group_Role) FROM groupmembers WHERE Group_Role=0 AND Group_Member_ID=subquery.Group_Member_ID)AS Advisor,(SELECT COUNT(Group_Role) FROM groupmembers WHERE Group_Role=1 AND Group_Member_ID=subquery.Group_Member_ID)AS Committee FROM (SELECT gmb.Group_Member_ID,usr.User_Email,usr.User_Name,usr.User_Role FROM groupmembers gmb RIGHT JOIN users usr ON gmb.User_Email=usr.User_Email WHERE usr.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=? AND Senior=?) AND (usr.User_Role=0 OR usr.User_Role=2))AS subquery ORDER BY User_Name ASC'

  con.query(
    countGroup,
    [Academic_Year, Academic_Term, Senior],
    (err, result, fields) => {
      if (err) {
        res.status(422).json({ msg: 'Query Error', status: 422 })
      } else {
        res.status(200).json({ data: result, status: 200 })
      }
    }
  )
}

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
  getGroupsFinalDoc,
  listrequestGroup,
  updateMemberStatus,
  getMyGroup,
  grading,
  deleteById,
  getOnlyGroupWithID,
  countTeachergroup,
  getAllFilesMajor,
  moveGroup,
  countProgressGroup,
  getGroupMajor,
  countOwnGroup,
  getAllFinalDoc
}
