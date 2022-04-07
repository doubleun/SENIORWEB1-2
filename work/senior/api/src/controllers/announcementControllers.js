const con = require("../config/db");

// For admin announcement use major id 99, (see major id in major table)

// get announcment by major id
getByMajorId = (req, res) => {
  const MajorID = req.body.MajorID;
  const sql =
    "SELECT * FROM `announcements` WHERE Major_ID=? OR Major_ID = 99 AND Project_on_term_ID = ? ORDER BY Publish_Date DESC";
  con.query(sql, [MajorID, req.user.projectOnTerm], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error", status: 500 }).end();
    } else {
      res.status(200).json(result);
    }
  });
};

// get all announcment
getAll = (req, res) => {
  const { Academic_Year, Academic_Term, Senior } = req.body;
  const sql =
    "SELECT ann.Announcement_ID,ann.Text,ann.Publish_Date,ann.Major_ID,mj.Major_Name FROM announcements ann INNER JOIN majors mj ON ann.Major_ID=mj.Major_ID WHERE ann.Project_on_term_ID=(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=? AND Senior=?) ORDER BY ann.Publish_Date DESC";
  con.query(
    sql,
    [Academic_Year, Academic_Term, Senior],
    (err, result, fields) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ msg: "Internal Server Error", status: 500 })
          .end();
      } else {
        res.status(200).json(result);
      }
    }
  );
};

// add announcement
add = (req, res) => {
  const { Text, MajorID, Academic_Year, Academic_Term, Senior } = req.body;

  // for coordinator
  const coordinatorAdd =
    "INSERT INTO `announcements` ( `Text`, `Major_ID`, `Project_on_term_ID`) VALUES (?,?,?);";

  const AdminAdd =
    "INSERT INTO `announcements` ( `Text`, `Major_ID`, `Project_on_term_ID`) VALUES (?,?,(SELECT Project_on_term_ID FROM projectonterm WHERE Academic_Year=? AND Academic_Term=? AND Senior=?));";
  con.query(
    req.user.role === 99 ? AdminAdd : coordinatorAdd,
    req.user.role === 99
      ? [Text, MajorID, Academic_Year, Academic_Term, Senior]
      : [Text, MajorID],
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
          .json({ msg: "add announcement successed", status: 200 })
          .end();
      }
    }
  );
};

// edit announcement
edit = (req, res) => {
  const { AnnouncementID, Text, MajorID } = req.body;
  // console.log("AnnouncementID: ", AnnouncementID);
  // console.log("Text: ", Text);
  // console.log("MajorID: ", MajorID);
  const sql =
    "UPDATE `announcements` SET `Text` = ?, `Major_ID` = ?,`Publish_Date`= current_timestamp() WHERE Announcement_ID = ?;";
  con.query(sql, [Text, MajorID, AnnouncementID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Internal Server Error", status: 500 }).end();
    } else {
      res
        .status(200)
        .json({ msg: "edit announcement successed", status: 200 })
        .end();
    }
  });
};

// delete announcement
deletes = (req, res) => {
  const { Announcement_ID } = req.body;
  // console.log("body:", req.body);
  // console.log("AnnounceID:", Announcement_ID);
  const sql = "DELETE FROM `announcements` WHERE `Announcement_ID` = ?";
  con.query(sql, [Announcement_ID], (err, result, fields) => {
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

module.exports = { getByMajorId, add, getAll, edit, deletes };
