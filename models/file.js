const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isPrivate: { type: Boolean, default: true },
  accessToken: { type: String },
  downloads: { type: Number, default: 0 },
  expirationDate: { type: Date },
  description: { type: String },
  tags: { type: [String] },
  sharedWith: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
});
const File = mongoose.model("File", fileSchema);
module.exports = File;
