const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema(
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
    parcelStatus: {
      type: String,
      unique: true,
    },
    message: {
      type: String,
      unique: true,
    },
    validflag: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Station", StationSchema);