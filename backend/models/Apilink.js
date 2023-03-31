const mongoose = require("mongoose");

const ApilinkSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      max: 20,
      unique: true,
    },
    description: String,
    validflag: {
      type: Boolean,
      default: true,
    },
    remark: String,
  },
  { timestamps: true }
);

const Apilink = mongoose.model("Apilink", ApilinkSchema);
export default Apilink;
