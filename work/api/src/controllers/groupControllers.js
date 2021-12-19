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
getAll = async (req, res) => {
    const sql = 'SELECT * FROM `groups`'
    await con.query(sql, (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json(result)
        }

    })
}

statusgroup = async (req, res) => {
    const {User_Status,User_Email,Group_Id} = req.body
    const sql = 'UPDATE groupmembers SET User_Status =? WHERE User_Email = ? AND Group_ID = ?;'
    await con.query(sql,[User_Status,User_Email,Group_Id], (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json(result)
        }

    })
}

module.exports = { getAll, createGroup,statusgroup }