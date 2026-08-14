const path = require("path");
const FileModel = require("../model/file.model");
const fs = require("fs");

const getType = (type) => {
  const ext = type.split("/").pop();
  if (ext === "x-msdownload") return "application/exe";
  if (ext === "octet-stream") return "application/msi";
  if (ext === "x-zip-compressed") return "application/zip";
  if (ext === "vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    return "application/xlsx";

  return type;
};

const createFile = async (req, res) => {
  try {
    const file = req.file;
    const { filename } = req.body;

    const payload = {
      filename: filename,
      path: `${file.destination}${file.filename}`,
      type: getType(file.mimetype),
      size: file.size,
      user: req.user.id,
    };

    const newFile = await FileModel.create(payload);
    res.status(200).json(newFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchFiles = async (req, res) => {
  try {
    const files = await FileModel.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await FileModel.findByIdAndDelete(id);
    if (!file) {
      res.status(404).json({ message: "File not found!" });
    }
    fs.unlinkSync(file.path);
    res.status(200).json({ message: "File Deleted Successfully", file });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await FileModel.findById(id);
    const ext = file.type.split("/").pop();

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const root = process.cwd();
    const filePath = path.join(root, file.path);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}.${ext}"`,
    );

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({ message: "File not found" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createFile, fetchFiles, deleteFile, downloadFile };
