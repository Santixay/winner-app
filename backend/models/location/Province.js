const mongoose = require("mongoose");

const ProvinceSchema = new mongoose.Schema(
  {
    pr_id: { type: String, required: true },
    pr_name: String,
    pr_name_en: String,
    default_route: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Province", ProvinceSchema);
