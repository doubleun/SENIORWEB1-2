const con = require("../config/db");

testuser = async (req, res) => {

    res.json(req.user)

}

countUser = async (req, res) => {
    const sql = "SELECT  (SELECT COUNT(*) FROM   permission WHERE Permission_Role=0 OR Permission_Role=1 OR Permission_Role=2) AS student,(SELECT COUNT(*) FROM   permission WHERE Permission_Role=3) AS teacher,(SELECT COUNT(*) FROM   groups) AS groups"

    await con.query(sql, (err, result, fields) => {
        if (err) {
            res.status(500).send("Internal Server Error");
        } else {
            console.log(result)
            res.status(200).json(result)
        }
    });
}

getAllUser = async (req, res) => {
    const sql = "SELECT * FROM `users`"

    await con.query(sql, (err, result, fields) => {
        if (err) {
            res.status(500).send("Internal Server Error");
        } else {
            console.log(result)
            res.status(200).json(result)
        }
    });
}

module.exports = {
    getAllUser,
    testuser,
    countUser
};