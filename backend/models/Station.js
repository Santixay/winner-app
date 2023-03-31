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

const Station = mongoose.model("Station", StationSchema);
export default Station;
