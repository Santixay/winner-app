const mongoose = require("mongoose");

const VillageSchema = new mongoose.Schema(
  {
    vill_id: String,
    vill_name: String,
    vill_name_en: String,
    dt_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Village", VillageSchema);
