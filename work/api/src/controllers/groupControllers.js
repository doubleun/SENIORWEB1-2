const con = require("../config/db");

createGroup = async () => {
    const { } = req.body
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

module.exports = { getAll }