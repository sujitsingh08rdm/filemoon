const path = require("path");
const FileModel = require("../model/file.model");
const fs = require("fs");

const createFile = async (req, res) => {
  try {
    const file = req.file;

    const payload = {
      filename: file.filename,
      path: `${file.destination}${file.filename}`,
      type: file.mimetype.split("/")[0],
      size: file.size,
    };
    const newFile = await FileModel.create(payload);
    res.status(200).json(newFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchFiles = async (req, res) => {
  try {
    const files = await FileModel.find();
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

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const root = process.cwd();
    const filePath = path.join(root, file.path);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`,
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
