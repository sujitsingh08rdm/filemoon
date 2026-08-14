const { Schema, model, mongoose } = require("mongoose");

const shareSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverEmail: {
      type: String,
      required: true,
    },
    file: {
      type: mongoose.Types.ObjectId,
      ref: "File",
      required: true,
    },
  },
  { timestamps: true },
);

const ShareModel = model("share", shareSchema);
module.exports = ShareModel;
