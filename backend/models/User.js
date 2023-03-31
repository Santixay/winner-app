const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    whatsapp: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },

    stations: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        default: { type: Boolean, required: true },
        parcelSatus: String,
      },
    ],
    validflag: {
      type: Boolean,
      default: true,
    },
    remark: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
