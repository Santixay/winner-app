const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    id: String,
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    whatsapp: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      index: true,
    },
    province: {
      pr_id: String,
      pr_name: String,
      pr_name_en: String,
      default_route: String,
    },
    district: {
      dt_id: String,
      dt_name: String,
      dt_name_en: String,
      pr_id: String,
    },
    village: {
      vill_id: String,
      vill_name: String,
      vill_name_en: String,
      dt_id: String,
    },
    remark: String,
    validflag: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);
