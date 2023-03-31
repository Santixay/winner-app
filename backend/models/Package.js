const mongoose = require("mongoose");
// const moment = require('moment-timezone');
// const dateLaos = moment(Date.now()).tz("Asia/Vientiane");

const PackageSchema = new mongoose.Schema(
  {
    tracking: {
      type: String,
      required: true,
      min: 8,
      max: 20,
      unique: true,
    },
    description: String,
    orderId: String,
    customerId: String,
    amount: Number,
    quantity: Number,
    shippingFee: Number,
    routeId: { type: String, required: true },
    station: String,
    status: String,
    remark: String,
    paymentStatus: Boolean,
    whatsappStatus: Boolean,
    validflag: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", PackageSchema);
export default Package;
