const con = require('../config/db')
const conPromise = con.promise()
var xlsx = require('node-xlsx')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')
const { result } = require('lodash')
const { createErrorJSON } = require('../utility')
const e = require('express')

// TODO: Move this to its own route ?
getTeacherRole = (req, res) => {
  const sql = 'SELECT * FROM `roles` WHERE Role_ID!=99 AND Role_ID!=1'
  con.query(sql, (err, result, fields) => {
    if (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.status(200).json(result)
    }
  })
}

updateUserRole = (req, res) => {
  const { User_Role, User_Email, Project_on_term_ID } = req.body
  const updateUserRoleSql =
    'UPDATE users SET User_Role = ? WHERE User_Email = ? AND Project_on_term_ID = ?'
  try {
    con.query(
      updateUserRoleSql,
      [User_Role, User_Email, Project_on_term_ID],
      (err, result) => {
        if (err) throw err
        res
          .status(200)
          .json({ msg: 'Update successfully', res: result, status: 200 })
        return
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
    return
  }
}

getUser = (req, res) => {
  // Each request has 'user' embeded in there, and the passport.js middleware on the backend node.js server 'deserialize' it
  // That's why this just respond back the req.user
  res.status(200).json(req.user)
  return
}

// FIXME: get req.body be year sem senior
countUser = (req, res) => {
  const { Academic_Year, Academic_Term, Senior } = req.body
  const sql =
    'SELECT (SELECT COUNT(*) FROM users WHERE User_Role=1 AND Project_on_term_ID = (SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=? AND Senior=?) ) AS student,(SELECT COUNT(*) FROM users WHERE User_Role=0 AND Project_on_term_ID = (SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=? AND Senior=?) ) AS teacher,(SELECT COUNT(*) FROM  groups WHERE (SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=? AND Senior=?)) AS groups'

  con.query(
    sql,
    [
      Academic_Year,
      Academic_Term,
      Senior,
      Academic_Year,
      Academic_Term,
      Senior,
      Academic_Year,
      Academic_Term,
      Senior
    ],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        // console.log(result[0]);
        res.status(200).json({
          students: result[0].student,
          teachers: result[0].teacher,
          groups: result[0].groups
        })
      }
    }
  )
}

// FIXME: duplicate user
getAllUserWithMajor = (req, res) => {
  const { Academic_Year, Academic_Term, Senior, User_Role, Major_ID } = req.body
  // const sql =
  //   "SELECT * FROM users usr INNER JOIN projectonterm pj ON usr.Project_on_term_ID=pj.Project_on_term_ID WHERE usr.Major_ID=? AND pj.Academic_Year=? AND pj.Academic_Term=? AND pj.Senior=? AND usr.User_Role!=99 AND usr.User_Role IN (?)";

  // user with role, year, semster, senior, major
  // const sql =
  //   "SELECT subquery.User_Email,subquery.User_Name,subquery.User_Identity_ID,subquery.User_Role,subquery.Major_ID,(SELECT Major_Name FROM majors WHERE Major_ID=subquery.Major_ID) AS Major_Name FROM (SELECT usr.User_Email,usr.User_Identity_ID,usr.User_Name,usr.User_Role,usr.Course_code,usr.Major_ID,usr.Project_on_term_ID FROM users usr INNER JOIN projectonterm pj ON usr.Project_on_term_ID=pj.Project_on_term_ID WHERE usr.Major_ID=? AND pj.Academic_Year=? AND pj.Academic_Term=? AND pj.Senior=? AND usr.User_Role!=99 AND usr.User_Role IN (?))AS subquery";

  // user with role, year, semster, senior, major
  const sql =
    'SELECT subquery.User_Identity_ID,subquery.User_Email,subquery.User_Name,subquery.User_Role,subquery.Major_ID,(SELECT Major_Name FROM majors WHERE Major_ID=subquery.Major_ID) AS Major_Name,subquery.Project_on_term_ID,(SELECT COUNT(Group_Role) FROM groupmembers WHERE Group_Role=0 AND User_Email =subquery.User_Email)AS Advisor,(SELECT COUNT(Group_Role) FROM groupmembers WHERE Group_Role=1 AND User_Email =subquery.User_Email)AS Committee FROM (SELECT gmb.Group_Member_ID,usr.User_Email,usr.User_Name,usr.User_Role,usr.Major_ID,usr.Project_on_term_ID,usr.User_Identity_ID FROM groupmembers gmb RIGHT JOIN users usr ON gmb.User_Email=usr.User_Email WHERE usr.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=? AND Senior=?) AND usr.User_Role IN (?) AND usr.Major_ID=? GROUP BY usr.User_Email ORDER BY usr.User_Email ASC)AS subquery ORDER BY User_Name ASC'

  console.log(req.body)

  con.query(
    sql,
    [Academic_Year, Academic_Term, Senior, User_Role, Major_ID],
    (err, result, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        console.log(result)
        res.status(200).json(result)
      }
    }
  )
}

getAllUsersInSchool = async (req, res) => {
  // const { Project_on_term_ID } = req.body;
  const studentsSQL =
    'SELECT `User_Email`, `User_Identity_ID`, `User_Name`, `User_Role` FROM `users` WHERE `User_Role` = 1 AND `Project_on_term_ID` = ?'
  const students = await new Promise((resolve, reject) => {
    con.query(
      studentsSQL,
      [req.user.projectOnTerm],
      (err, studentsResult, fields) => {
        if (err) {
          console.log(err)
          res.status(500).send('Internal Server Error')
        } else {
          resolve(studentsResult)
        }
      }
    )
  })
  const teachersSQL =
    'SELECT `User_Email`, `User_Identity_ID`, `User_Name`, `User_Role` FROM `users` WHERE `User_Role` = 0 OR `User_Role` = 2 AND `Project_on_term_ID` = ?'
  const teachers = await new Promise((resolve, reject) => {
    con.query(
      teachersSQL,
      [req.user.projectOnTerm],
      (err, teachersResult, fields) => {
        if (err) {
          console.log(err)
          res.status(500).send('Internal Server Error')
        } else {
          resolve(teachersResult)
        }
      }
    )
  })
  res.status(200).json({ students, teachers, status: 200 })
}

uploadfile = async (req, res) => {
  const { Major } = req.body
  const { projectOnTerm } = req.user
  try {
    // begin transaction
    await conPromise.beginTransaction((err) => {
      if (err) throw { message: 'Interal server error', status: 500 }
    })

    if (!req.file) {
      throw { message: 'No file uploaded', status: 400 }
    }

    let rows = await readXlsxFile(req.file.path).catch((err) => {
      console.log('real excel file failed')
      throw { message: 'Interal server error', status: 500 }
    })

    if (rows[0][0] !== 'MAE FAH LUANG UNIVERSITY') {
      throw { msg: 'Wrong data', status: 400 }
    }

    let coursec = rows[4][0].split(' ')[4]

    // use start index with 8 because user information start at index 8
    rows = rows.slice(8)

    console.log('raw rows', rows)
    console.log('new rows', rows)

    // map rows to users
    let users = rows.map((el) => [
      el[1] + '@lamduan.mfu.ac.th', // email
      el[1], // id
      el[2], // name
      1, // role
      coursec, // course id
      Major, // major id
      projectOnTerm // projcet on term id
    ])
    // console.log('user', users)

    // insert users
    let importUsers =
      'INSERT IGNORE INTO users ( User_Email , User_Identity_ID , User_Name , User_Role , Course_code , Major_ID ,  Project_on_term_ID ) VALUES ?'

    const [{ affectedRows }] = await conPromise.query(
      importUsers,
      [users],
      (err) => {
        if (err) {
          console.log('insert error')
          throw { message: 'Interal server error', status: 500 }
        }
      }
    )

    await conPromise.commit()
    res.status(200).json({
      msg: `Import students successfully with ${affectedRows} users`,
      status: 200
    })
  } catch (err) {
    console.log(err)
    conPromise.rollback()
    res.status(err.status).json(
      createErrorJSON({
        msg: err.msg,
        errDialog: { enabled: true, redirect: false }
      })
    )
  }
}

uploadfileteacher = async (req, res) => {
  const { year, semester, senior } = req.body
  let coursec = null
  try {
    // begin transaction
    await conPromise.beginTransaction((err) => {
      if (err) throw { message: 'Interal server error', status: 500 }
    })

    // console.log('File: ', req.file)
    if (!req.file) {
      throw { message: 'No file uploaded', status: 400 }
    }

    // read excel file
    let rows = await readXlsxFile(req.file.path).catch((err) => {
      console.log('real excel file failed')
      throw { message: 'Interal server error', status: 500 }
    })

    if (
      rows[0][0] !==
      'รายชื่อบุคคลากร สำนักวิชาเทคโนโลยีสารสนเทศ มหาวิทยาลัยแม่ฟ้าหลวง'
    ) {
      throw { msg: 'Wrong data', status: 400 }
    }

    // get majors to mapping with excel
    let queryMajors = 'SELECT * FROM `majors`'
    let [majors] = await conPromise.query(queryMajors).catch((err) => {
      throw { message: 'Interal server error', status: 500 }
    })

    // get project_on_term_ID to mapping with excel
    let queryProjectOnTerm =
      'SELECT `Project_on_term_ID` FROM `projectonterm` WHERE Academic_Year =? AND Academic_Term = ? AND Senior = ?'
    let [project_on_term_ID] = await conPromise.query(
      queryProjectOnTerm,
      [year, semester, senior],
      (err) => {
        if (err) {
          throw { message: 'Interal server error', status: 500 }
        }
      }
    )

    // use start index with 4 because user information start at index 4
    rows = rows.slice(4)

    // map major to object
    majors = majors.reduce(
      (obj, el) => ({ ...obj, [el.Acronym]: el.Major_ID }),
      {}
    )

    // map rows to users
    let users = rows.map((el) => [
      el[3], // email
      el[1], // identity
      el[2], // name
      0, // role
      coursec, // course id
      majors[el[4]], // major id
      project_on_term_ID[0].Project_on_term_ID // projcet on term id
    ])

    // insert users
    let importUsers =
      'INSERT IGNORE INTO `users`(`User_Email`, `User_Identity_ID`, `User_Name`, `User_Role`, `Course_code`, `Major_ID` , `Project_on_term_ID`) VALUES ?'

    const [{ affectedRows }] = await conPromise.query(
      importUsers,
      [users],
      (err) => {
        if (err) throw { message: 'Interal server error', status: 500 }
      }
    )

    // console.log('affectedRows', affectedRows)

    // console.log('rows', rows)
    // console.log('majors', majors)
    // console.log('users', users)
    // console.log('project_on_term_ID', project_on_term_ID[0].project_on_term_ID)

    await conPromise.commit()
    res.status(200).json({
      msg: `Import teachers successfully with ${affectedRows} users`,
      status: 200
    })
  } catch (err) {
    console.log(err)
    res.status(err.status).json(
      createErrorJSON({
        msg: err.msg,
        errDialog: { enabled: true, redirect: false }
      })
    )
    // console.log(err.status)
    // console.log(err.msg)

    // res.status(500).json({ msg: err.msg, status: 500 })
  }
}

getUserProjectOnTerm = (req, res) => {
  const { seniorFromRoute } = req.body
  const { email, major, senior, projectOnTerm } = req.user

  console.log('seniorFromRoute', seniorFromRoute)
  console.log(email, major, senior, projectOnTerm)

  try {
    // 1.) Check if senior and proejectOnTerm exist in the token
    if (!senior || !projectOnTerm) {
      // 2.) Fetch senior and project on term
      const getUserSeniorSql =
        'SELECT u.Project_on_term_ID, pj.Academic_Year, pj.Academic_Term, pj.Senior, pj.Access_Date_End FROM `users` u INNER JOIN projectonterm pj ON u.Project_on_term_ID = pj.Project_on_term_ID WHERE u.User_Email = ? AND u.Major_ID = ? AND pj.Senior = ?'
      con.query(
        getUserSeniorSql,
        [email, major, seniorFromRoute],
        (err, result, fields) => {
          if (err) throw err
          console.log('res', result)
          req.user.accessDateEnd = result[0].Access_Date_End
          req.user.senior = result[0].Senior
          req.user.academicYear = result[0].Academic_Year
          req.user.semester = result[0].Academic_Term
          req.user.projectOnTerm = result[0].Project_on_term_ID
          res.status(200).json({
            Academic_Year: result[0].Academic_Year,
            Academic_Term: result[0].Academic_Term,
            Senior: result[0].Senior
          })
          return
        }
      )
    } else {
      res.status(200).send('Project on term already exist')
      return
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
    return
  }
}
getUserAvailableSeniors = (req, res) => {
  const { email } = req.user
  try {
    // TODO: Re-check SQL query
    const getUserSeniorSql =
      'SELECT MAX(pj.Project_on_term_ID) AS projectOnTerm, (SELECT Academic_Year FROM projectonterm WHERE Project_on_term_ID =  MAX(pj.Project_on_term_ID)) AS year,(SELECT Academic_Term FROM projectonterm WHERE Project_on_term_ID =  MAX(pj.Project_on_term_ID)) AS semester, pj.Senior FROM `projectonterm` as pj INNER JOIN `users` u ON pj.Project_on_term_ID = u.Project_on_term_ID WHERE u.User_Email = ? GROUP BY pj.Senior ORDER BY pj.Senior ASC LIMIT 2'
    con.query(getUserSeniorSql, [email], (err, result) => {
      if (err) throw err
      res.status(200).json(result)
    })
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
    return
  }
}

module.exports = {
  getAllUserWithMajor,
  getAllUsersInSchool,
  uploadfileteacher,
  uploadfile,
  countUser,
  getUser,
  updateUserRole,
  getTeacherRole,
  getUserProjectOnTerm,
  getUserAvailableSeniors
}
