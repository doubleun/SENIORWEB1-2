const con = require("../config/db");

testuser = async (req, res) => {

    return res.status(200).send('hellow')
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
    // console.log(data.result)

    // console.log(err.sqlMessage)
    // res.status(500).send("Internal Server Error");

    // con.query(sql,(err,result,fields)=>{
    //     if()
    // })
}

module.exports = {
    getAllUser,
    testuser,
};