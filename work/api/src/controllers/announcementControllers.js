const con = require('../config/db')

// For admin announcement use major id 99, (see major id in major table)

// get announcment by major id
getById = async (req, res) => {
    const MajorID = req.body.MajorID
    console.log(MajorID)
    const sql = 'SELECT * FROM `announcements` WHERE Major_ID=?'
    await con.query(sql, MajorID, (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json(result)
        }
    })
}

// get all announcment
getAll = async (req, res) => {
    const MajorID = req.body.MajorID
    console.log(MajorID)
    const sql = 'SELECT * FROM `announcements`'
    await con.query(sql, MajorID, (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json(result)
        }
    })
}

// add announcement
add = async (req, res) => {
    const { Text, MajorID } = req.body
    const sql = 'INSERT INTO announcements ( Text, Major_ID) VALUES(?,?)'
    await con.query(sql, [Text, MajorID], (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).send('add announcement successed').end()
        }
    })
}

// edit announcement
edit = async (req, res) => {
    const { Text, MajorID } = req.body
    const sql = 'UPDATE `announcements` SET `Text` = ? WHERE Announcement_ID = ?;'
    await con.query(sql, [Text, MajorID], (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).send('add announcement successed').end()
        }
    })
}

// delete announcement
deletes = async (req, res) => {
    const { MajorID } = req.body
    const sql = 'DELETE FROM `announcements` WHERE `announcements`.`Announcement_ID` = ?'
    await con.query(sql, [Text, MajorID], (err, result, fields) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).send('add announcement successed').end()
        }
    })
}

module.exports = { getById, add, getAll, edit, deletes }