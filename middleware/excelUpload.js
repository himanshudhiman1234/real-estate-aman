const multer = require("multer");
const path = require("path");

const excelStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "excel-" + Date.now() + path.extname(file.originalname));
  }
});

const excelUpload = multer({ storage: excelStorage });

module.exports = excelUpload;