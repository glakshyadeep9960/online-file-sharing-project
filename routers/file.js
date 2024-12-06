const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const express = require("express");
const VerifyToken = require("../middleware/user");
const {
  uploadFile,
  getAllFile,
  getFile,
  sendFile,
} = require("../controllers/file");
const fileRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto
      .randomBytes(8)
      .toString("hex")}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

fileRouter
  .route("/upload")
  .post(upload.single("file"), VerifyToken, uploadFile);
fileRouter.route("/get-all-files").get(VerifyToken, getAllFile);
fileRouter.route("/get-file/:accessToken").get(VerifyToken, getFile);
fileRouter.route("/send-file").post(VerifyToken, sendFile);

module.exports = fileRouter;
