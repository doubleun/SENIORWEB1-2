const con = require("../config/db");

// get progression of dua date by major
getProgressionDuedate = async (req, res) => {
    const { Major_ID, Project_on_term_ID } = req.body
    // const Project_on_term_ID = req.params.Project_on_term_ID
    const sql = "SELECT * FROM `progressionsinfo` WHERE Major_ID=? AND Project_on_term_ID=?";
    await con.query(sql, [Major_ID, Project_on_term_ID], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json(result);
        }
    });
};

// update progression duedate
updateProgressionDuedate = async (req, res) => {
    // if no progression data, 
    //      fontend must send Progression_Info_ID=0 to backend, 
    //      if have progression data send Progression_Info_ID to backend

    const { DueDate_Start, DueDate_End, Progress_ID, Major_ID, Project_on_term_ID, Progression_Info_ID } = req.body
    const insert = "INSERT INTO `progressionsinfo` ( `DueDate_Start`, `DueDate_End`, `Progress_ID`, `Major_ID`, `Project_on_term_ID`) VALUES (?,?,?,?,?);";
    const update = "UPDATE `progressionsinfo` SET `DueDate_Start` = ?, `DueDate_End` = ?, `Progress_ID` = ?, `Major_ID` = ?, `Project_on_term_ID` = ? WHERE `progressionsinfo`.`Progression_Info_ID` = ?;";

    if (Progression_Info_ID == 0) {
        await con.query(insert, [DueDate_Start, DueDate_End, Progress_ID, Major_ID, Project_on_term_ID], (err, insert, fields) => {
            if (err) {
                console.log(err)
                res.status(500).send("Internal Server Error")
            } else {
                res.status(200).send("insert")
            }
        })
    }
    else {
        await con.query(update, [DueDate_Start, DueDate_End, Progress_ID, Major_ID, Project_on_term_ID, Progression_Info_ID], (err, insert, fields) => {
            if (err) {
                console.log(err)
                res.status(500).send("Internal Server Error")
            } else {
                res.status(200).send("updated")
            }
        })
    }
};



module.exports = {
    getProgressionDuedate,
    updateProgressionDuedate
}