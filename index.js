const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB)
  .then(() => console.log("connected DB"))
  .catch((error) => console.log("error", error.message));

const root = process.cwd();

const express = require("express");
const path = require("path");
const { v4: uniqueId } = require("uuid");
const cors = require("cors");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, "files/");
  },
  filename: (req, file, next) => {
    const nameArr = file.originalname.split(".");
    const ext = nameArr.pop();
    const name = `${uniqueId()}.${ext}`;

    next(null, name);
  },
});
const upload = multer({ storage: storage });

const { signUp, login } = require("./controller/user.controller");
const {
  createFile,
  fetchFiles,
  deleteFile,
  downloadFile,
} = require("./controller/file.controller");
const { shareFile } = require("./controller/share.controller");
const { fetchDashboard } = require("./controller/dashboard.controller");
const { verifyToken } = require("./controller/token.controller");
const app = express();
app.listen(process.env.PORT || 8080);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("view"));

app.use(cors({ origin: "http://localhost:5500" }));

// UI ENDPOINT
const getPath = (filename) => {
  return path.join(root, "view", filename);
};

app.get("/signup", (req, res) => {
  const p = res.sendFile(getPath("signup.html"), (err) => {
    if (err) {
      res.send("404 | NOT FOUND");
    }
  });
});

app.get("/login", (req, res) => {
  const p = getPath("index.html");
  res.sendFile(p);
});

app.get("/", (req, res) => {
  const p = getPath("index.html");
  res.sendFile(p);
});

app.get("/dashboard", (req, res) => {
  const p = getPath("app/dashboard.html");
  res.sendFile(p);
});

app.get("/history", (req, res) => {
  const p = getPath("app/history.html");
  res.sendFile(p);
});

app.get("/files", (req, res) => {
  const p = getPath("app/files.html");
  res.sendFile(p);
});

// API ENDPOINT
app.post("/api/signup", signUp);
app.post("/api/login", login);

app.post("/api/file", upload.single("file"), createFile);
app.get("/api/file", fetchFiles);
app.delete("/api/file/:id", deleteFile);
app.get("/api/file/download/:id", downloadFile);

app.get("/api/dashboard", fetchDashboard);
app.post("/api/token/verify", verifyToken);
app.post("/api/share", shareFile);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint Not Found" });
});
