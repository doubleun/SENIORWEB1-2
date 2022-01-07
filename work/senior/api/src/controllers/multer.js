const multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "api/uploads/assignments");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});


const upload = multer({ storage });

storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "api/uploads/excel");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});


const uploadUser = multer({ storage });

module.exports = { upload,uploadUser };
