const con = require("../config/db");

createGroup = async () => {
    const { } = req.body
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

module.exports = { getByMajor, deletes }