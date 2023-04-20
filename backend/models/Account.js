const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    THB: { type: Number, required: true, default: 0 },
    LAK: { type: Number, required: true, default: 0 },
    USD: { type: Number, required: true, default: 0 },
    customerId: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: String,
    validflag: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", AccountSchema);
