const UserModel = require("../model/user.model");
const bcrypt = require("bcrypt");

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
    console.log(email);

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found! Please register" });
    }

    const isLogin = bcrypt.compareSync(password, user.password);

    if (!isLogin)
      return res.status(401).json({ message: "Incorrect password" });

    res.status(200).json({ message: "Login success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signUp, login };
