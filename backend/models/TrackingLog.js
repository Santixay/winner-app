const mongoose = require("mongoose");

const TrackingLogSchema = new mongoose.Schema(
  {
    packageId: {
      type: String,
      required: true,
    },
    tracking: {
      type: String,
      required: true,
    },
    station: {
      type: String,
      required: true,
    },
    description: String,
    reamrk: String,
    actionByUser: String,
    validflag: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrackingLog", TrackingLogSchema);