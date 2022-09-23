const con = require("../config/db");
const { formatDateIso } = require("../utility");

// Get latest project on term id
getLatestProjectOnTerm = async(req, res) => {
    const getLatestProjectOnTermSql =
        "SELECT * FROM `projectonterm` ORDER BY `Project_on_term_ID` DESC LIMIT 1";
    try {
        con.query(getLatestProjectOnTermSql, (err, projectOnTerm) => {
            if (err) throw err;
            res.status(200).json(projectOnTerm[0]);
            return;
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
    }
};

// Get project on term id from semester and year
getProjectOnTerm = async(req, res) => {
    const { Academic_Year, Academic_Term } = req.body;
    const getProjectOnTermSql =
        "SELECT * FROM `projectonterm` WHERE `Academic_Year` = ? AND `Academic_Term` = ? ORDER BY `Project_on_term_ID` DESC";
    try {
        con.query(
            getProjectOnTermSql, [Academic_Year, Academic_Term],
            (err, projectOnTerm) => {
                if (err) throw err;
                projectOnTerm.forEach((item) => {
                    item.Access_Date_Start = formatDateIso(item.Access_Date_Start);
                    item.Access_Date_End = formatDateIso(item.Access_Date_End);
                });
                // TODO: If we want to add only latest from each seniors are editable, then do it here
                // console.log("projectOnTerm", projectOnTerm);
                res.status(200).json(projectOnTerm);
                return;
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
    }
};

// Academic year
getAcademicYear = (req, res) => {
    const sql =
        "SELECT * FROM `academicyear` ORDER BY `Academic_Year` DESC LIMIT 1";
    con.query(sql, (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        } else {
            res.status(200).json(result);
            return;
        }
    });
};

newAcademicYear = (req, res) => {
    const { year } = req.body;

    const sql = "INSERT INTO `academicyear`(`Academic_Year`) VALUES (?)";
    con.query(sql, [year], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(422).json({ msg: "Query Error", err });
            return;
        } else {
            res.status(200).json({ msg: "Query Error", status: 200, result });
            return;
        }
    });
};

// Semester date
getSemesterDate = (req, res) => {
    const { year, senior } = req.body;
    const sql =
        "SELECT * FROM `projectonterm` WHERE `Academic_Year` = ? AND `Senior` = ? ORDER BY `Project_on_term_ID`";
    con.query(sql, [year, senior], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        } else {
            res.status(200).json(result);
            return;
        }
    });
};

newSemesterDate = (req, res) => {
    const { data } = req.body;
    console.log("data", data);
    try {
        const addNewSemesterSql =
            "INSERT IGNORE INTO `projectonterm`(`Academic_Year`, `Academic_Term`, `Senior`, `Access_Date_Start`, `Access_Date_End`) VALUES (?, ?, ?, ?, ?)";
        con.query(addNewSemesterSql, data, (err, result) => {
            if (err) throw err;
            console.log("result", result);
            res.status(200).json(result);
            return;
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
        return;
    }
    // const { data } = req.body;
    // // TODO: Refactor, this used to be multiple insertion, but now it's one at a time
    // const sql =
    //   "INSERT IGNORE INTO `projectonterm`(`Academic_Year`, `Academic_Term`, `Access_Date_Start`, `Access_Date_End`, `Senior`) VALUES ?";
    // con.query(
    //   sql,
    //   [data.map((obj) => Object.values(obj))],
    //   (err, result, fields) => {
    //     if (err) {
    //       console.log(err);
    //       res.status(422).json({ msg: "Query Error", err });
    //       return;
    //     } else {
    //       res.status(200).json({ msg: "Query Error", status: 200, result });
    //       return;
    //     }
    //   }
    // );
};

updateSemesterDate = async(req, res) => {
    const { data } = req.body;
    console.log("data", data);

    // Update semester date
    const updateSql =
        "UPDATE `projectonterm` SET `Access_Date_Start`=?, `Access_Date_End`=? WHERE `Project_on_term_ID` = ?";
    con.query(updateSql, data, (err, result, fields) => {
        try {
            if (err) throw err;
            res.status(200).json({ msg: "Successed!", status: 200 });
            return;
        } catch (err) {
            console.log(err);
            res.status(422).json({ msg: "Query Error", status: 422 });
            return;
        }
    });
};

// Get all available years, semester and senior for Admin
getYearsSemester = (req, res) => {
    try {
        const getSemesterDataSql =
            "SELECT `Academic_Year`, `Academic_Term`, `Senior` FROM `projectonterm` ORDER BY Academic_Year DESC";
        con.query(getSemesterDataSql, (err, result) => {
            if (err) throw err;
            res.status(200).json(result);
            return;
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
    }
};

module.exports = {
    getLatestProjectOnTerm,
    getProjectOnTerm,
    getAcademicYear,
    newAcademicYear,
    getSemesterDate,
    newSemesterDate,
    updateSemesterDate,
    getYearsSemester,
};