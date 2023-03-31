const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema(
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
    description: {
      type: String,
    },
    navigator: [
      {
        station: { type: String, required: true },
        status: { type: String, required: true },
        message: { type: String, required: true },
        orderNum: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports  = mongoose.model("Route", RouteSchema);