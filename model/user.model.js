const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid Email"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  const count = await model("User").countDocuments({ mobile: this.mobile });

  if (count > 0) {
    throw new Error("Mobile number already exists");
  }
});

userSchema.pre("save", async function () {
  const count = await model("User").countDocuments({ email: this.email });

  if (count > 0) {
    throw new Error("Email already exists, try again with different email");
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const encryptedPass = await bcrypt.hash(this.password.toString(), 12);
  this.password = encryptedPass;
});

const UserModel = model("User", userSchema);

module.exports = UserModel;
