const mongoose = require("mongoose");

const TransactionDetailSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    detail: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransactionDetail", TransactionDetailSchema);
