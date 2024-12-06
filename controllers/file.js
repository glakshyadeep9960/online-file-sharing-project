const File = require("../models/file");
const crypto = require("crypto");
const path = require("path");
const sendMail = require("./sendMail");
exports.uploadFile = async (req, res) => {
  const { id } = req.user;
  const { tags, description, sharedWith, expirationDate } = req.body;
  try {
    if (!req.file) {
      console.log("File upload missing");
      return res.status(400).json({ message: "File not uploaded!" });
    }

    const accessToken = crypto.randomBytes(16).toString("hex");

    const newFile = new File({
      fileName: req.file.originalname,
      storedName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      uploadDate: new Date(),
      uploaderId: id || null,
      isPrivate: true,
      accessToken,
      downloads: 0,
      description: description || "",
      tags: tags || [],
      sharedWith: sharedWith || [],
      expirationDate: expirationDate || null,
    });

    await newFile.save();

    res.status(201).json({
      message: "File uploaded successfully!",
      accessToken,
      fileId: newFile._id,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "Failed to upload file", error: error.message });
  }
};

exports.getAllFile = async (req, res) => {
  try {
    const { id } = req.user;
    const files = await File.find({ uploaderId: id });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found!" });
    }

    return res.status(200).json({
      message: "Files fetched successfully!",
      files,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({
      message: "An error occurred while fetching files.",
      error: error.message,
    });
  }
};

exports.getFile = async (req, res) => {
  try {
    const { accessToken } = req.params;
    const file = await File.findOne({ accessToken });

    if (!file) {
      return res.status(404).json({ message: "File not found!" });
    }

    file.downloads += 1;
    await file.save();

    return res.sendFile(path.resolve(file.filePath), (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res
          .status(500)
          .json({ message: "Error occurred while sending the file." });
      }
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the file.",
      error: error.message,
    });
  }
};

exports.sendFile = async (req, res) => {
  const { email, accessToken } = req.body;

  try {
    const file = await File.findOne({ accessToken });
    if (!file) {
      return res.status(404).json({ message: "File not found!" });
    }
    const filePath = file.filePath.replace(/\\/g, "/");
    const downloadUrl = `${process.env.BACKEND_URL}/${filePath}`;
    const message = `Hello!

    To access the file, click the link below and enter the required access token:
        
    Download the file: ${downloadUrl}
    
   `;
    await sendMail(email, file.fileName, message);
    return res.status(200).json({ message: "File Sent Successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An Error Occured in sending file via email" });
  }
};
