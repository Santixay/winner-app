const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      max: 20,
      unique: true,
    },
    description: String,
    permission: [
      {
        method: { type: String, required: true },
        path: { type: String, required: true },
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

const Role = mongoose.model("Role", RoleSchema);
export default Role;
