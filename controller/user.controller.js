const UserModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const signUp = async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(200).json({ message: "Signup successfull" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found! Please register" });
    }

    const isLogin = bcrypt.compareSync(password, user.password);

    if (!isLogin)
      return res.status(401).json({ message: "Incorrect password" });

    const payload = {
      email: user.email,
      fullname: user.fullname,
      mobile: user.mobile,
      id: user._id,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Login success", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    const { filename } = req.file;
    const user = await UserModel.findByIdAndUpdate(req.user.id, {
      image: filename,
    });

    if (!user) return res.status(401).json({ message: "UnAuth User" });

    res.status(200).json({ image: user.image });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

const fetchImage = async (req, res) => {
  try {
    const { image } = await UserModel.findById(req.user.id);
    if (!image) {
      return res
        .status(404)
        .json({ message: "Something went wrong with sending image" });
    }
    const root = process.cwd();
    const file = path.join(root, "files", image);
    res.sendFile(file, (err) => {
      if (err)
        res
          .status(404)
          .json({ message: "Something went wrong with sending image" });
    });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signUp, login, updateProfilePic, fetchImage };
