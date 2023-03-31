const mongoose = require("mongoose");

const DistrictSchema = new mongoose.Schema(
  {    
    dt_id: String,
    dt_name: String,
    dt_name_en: String,
    pr_id: String,
  },
  { timestamps: true }
);

const District = mongoose.model("District", DistrictSchema);
export default District;
