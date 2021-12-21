const con = require("../config/db");

createGroup = async (req, res) => {
    const { Project_NameTh, Project_NameEn, Studen_Number, Advisor_Email, CoAdvisor_Name, Committee1_Email, Committee2_Email, Student1_Tel, Student2_Tel, Student3_Tel, Student4_Tel, Email_Student1, Major, Email_Student2, Email_Student3, Email_Student4 } = req.body
    console.log(Project_NameEn + " " + Project_NameTh + " " + CoAdvisor_Name + " " + Major)
    const sql = 'INSERT INTO groups (Group_Name_Thai,Group_Name_Eng,Co_Advisor,Major) VALUES (?,?,?,?);'
    const sql2 = 'INSERT INTO `groupmembers`( `User_Email`, `User_Phone`, `Group_Role`, `Group_ID`) VALUES (?,(SELECT MAX(Group_ID) FROM groups))'
    let user = []
    user.push([Email_Student1, Student1_Tel, 3])
    user.push([Email_Student2, Student2_Tel, 2])
    if (Studen_Number == 3) {
        user.push([Email_Student3, Student3_Tel, 2])
    } else if (Studen_Number == 4) {
        user.push([Email_Student3, Student3_Tel, 2])
        user.push([Email_Student4, Student4_Tel, 2])
    }
    user.push([Advisor_Email, "", 0])
    user.push([Committee1_Email, "", 1])
    user.push([Committee2_Email, "", 1])
    console.log(user.length)

    await con.query(
        sql,
        [
            Project_NameTh,
            Project_NameEn,
            CoAdvisor_Name,
            Major
        ],
        async (err, result, fields) => {
            if (err) {
                console.log("error code first is " + err.code);
                if (err.code == "ER_DUP_ENTRY") {
                    res.status(500).send("Duplicate data");
                } else {
                    res.status(500).send("Internal Server Error");
                }
            } else {
                for (let i = 0; i < user.length; i++) {
                    await con.query(
                        sql2,
                        [
                            user[i]
                        ],
                        (err, result, fields) => {
                            if (err) {
                                console.log("error code second is " + err.code);
                                if (err.code == "ER_DUP_ENTRY") {
                                    res.status(500).send("Duplicate data");
                                } else {
                                    res.status(500).send("Internal Server Error");
                                }
                            } else {

                            }
                        }
                    )
                }
            }
        }
    );


}

// get all group
// TODO: get by major
getByMajor = async (req, res) => {
    const major = req.body.Major

    const sql = 'SELECT * FROM `groups` WHERE Major = ?'
    await con.query(sql, [major], (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json(result)
        }

    })
}

getByRole = async (req, res) => {
    const Email = req.body.Email

    const sql = 'SELECT COUNT(Group_Member_ID) AS commitee,(SELECT COUNT(Group_Member_ID) FROM `groupmembers` WHERE User_Email = ? AND Group_Role = 0) AS advicee FROM `groupmembers` WHERE User_Email = ? AND Group_Role = 1;'
    await con.query(sql, [Email, Email], async (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json(result)
        }

    })
}

deletes = async (req, res) => {
    const groupId = req.body.Group_ID
    const sql = 'UPDATE `groups` SET `Group_Status` = 0 WHERE `Group_ID` = ?;'
    await con.query(sql, [groupId], (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json(result)
        }

    })
}

statusgroup = async (req, res) => {
    const { User_Status, User_Email, Group_Id } = req.body
    const sql = 'UPDATE groupmembers SET User_Status =? WHERE User_Email = ? AND Group_ID = ?;'
    await con.query(sql, [User_Status, User_Email, Group_Id], (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json(result)
        }

    })
}

// list group that teacher are advisor or committee
listOwnGroup = async (req, res) => {
    const { User_Email, Project_on_term_ID, Group_Role } = req.body
    const sql = 'SELECT * FROM groupmembers,groups WHERE groupmembers.Group_ID= groups.Group_ID AND groupmembers.Group_ID IN (SELECT Group_ID FROM groupmembers WHERE User_Email =?AND Group_Role=?) AND groups.Project_on_term_ID=?'
    await con.query(sql, [User_Email, Group_Role, Project_on_term_ID], (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json(result)
        }
    })
}


module.exports = {
    getAll,
    createGroup,
    statusgroup,
    getByMajor,
    deletes,
    getByRole,
    listOwnGroup
}
