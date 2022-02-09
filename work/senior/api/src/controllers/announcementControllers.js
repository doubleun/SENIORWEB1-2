const con = require("../config/db");

// For admin announcement use major id 99, (see major id in major table)

// get announcment by major id
getById = (req, res) => {
  const MajorID = req.body.MajorID;
  console.log(MajorID);
  const sql = "SELECT * FROM `announcements` WHERE Major_ID=? OR Major_ID = 99";
  con.query(sql, MajorID, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error", status: 500 }).end();
    } else {
      res.status(200).json(result);
    }
  });
};

// get all announcment
getAll = async (req, res) => {
  const MajorID = req.body.MajorID;
  console.log(MajorID);
  const sql =
    "SELECT ann.Announcement_ID,ann.Text,ann.Publish_Date,ann.Major_ID,mj.Major_Name FROM announcements ann INNER JOIN majors mj ON ann.Major_ID=mj.Major_ID";
  await con.query(sql, MajorID, (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error", status: 500 }).end();
    } else {
      res.status(200).json(result);
    }
  });
};

// add announcement
add = async (req, res) => {
  const { Text, MajorID } = req.body;
  const sql = "INSERT INTO announcements ( Text, Major_ID) VALUES(?,?)";
  await con.query(sql, [Text, MajorID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error", status: 500 }).end();
    } else {
      res
        .status(200)
        .json({ msg: "add announcement successed", status: 200 })
        .end();
    }
  });
};

// edit announcement
edit = async (req, res) => {
  const { AnnouncementID, Text, MajorID } = req.body;
  console.log("AnnouncementID: ", AnnouncementID);
  console.log("Text: ", Text);
  console.log("MajorID: ", MajorID);
  const sql =
    "UPDATE `announcements` SET `Text` = ?, `Major_ID` = ? WHERE Announcement_ID = ?;";
  await con.query(
    sql,
    [Text, MajorID, AnnouncementID],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ msg: "Internal Server Error", status: 500 })
          .end();
      } else {
        res
          .status(200)
          .json({ msg: "edit announcement successed", status: 200 })
          .end();
      }
    }
  );
};

// delete announcement
deletes = async (req, res) => {
  const { Announcement_ID } = req.body;
  console.log("body:", req.body);
  console.log("AnnounceID:", Announcement_ID);
  const sql = "DELETE FROM `announcements` WHERE `Announcement_ID` = ?";
  await con.query(sql, [Announcement_ID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error", status: 500 }).end();
    } else {
      res
        .status(200)
        .json({ msg: "delete announcement successed", status: 200 })
        .end();
    }
  });
};

module.exports = { getById, add, getAll, edit, deletes };
