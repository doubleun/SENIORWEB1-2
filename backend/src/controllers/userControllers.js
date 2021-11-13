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

uploadfile = async(req,res) =>{
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files[''];
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
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