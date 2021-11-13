const con = require("../config/db");
var xlsx = require('node-xlsx');
const fs = require('fs');
const readXlsxFile = require('read-excel-file/node')


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

uploadfile = async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files[''];


            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('uploads/' + avatar.name);
            var data = []
            let count = 0;
            var sql = "INSERT INTO `users` (`User_ID`, `User_Name`, `User_Email`, `User_Phone`, `User_Role`, `Major_ID`) VALUES (?)";
            var obj = readXlsxFile("uploads/" + avatar.name).then((rows) => {
                for (let i = 1; i < rows.length; i++) {
                    if (rows[i][4] == 'teacher') {
                        rows[i][4] = 0
                    } else {
                        rows[i][4] = 1
                    }
                    if (rows[i][5] == 'CSI') {
                        rows[i][5] = 1
                    } else if (rows[i][5] == 'SE') {
                        rows[i][5] = 1
                    } else if (rows[i][5] == 'CE') {
                        rows[i][5] = 1
                    } else if (rows[i][5] == 'ICE') {
                        rows[i][5] = 1
                    }
                    // data.push(rows[i])
                    con.query(sql, [rows[i]], (err, result, fields) => {
                        if (err) {
                            console.log(err.code)
                            if(err.code == "ER_DUP_ENTRY"){
                                res.status(500).send("Duplicate data");
                            }else{
                                res.status(500).send("Internal Server Error");
                            }
                        } else {
                            count++
                            if (count == rows.length-1) {
                    res.status(200).send("success")
                }
                        }
                    });
                }
                

            })


        }
    } catch (err) {
        res.status(500).send(err);
        console.log(err)
    }
}


module.exports = {
    getAllUser,
    testuser,
    uploadfile,
};