const { string } = require("joi");
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    txn_type: {
      type: String,
      enum: ["debit", "credit"],
      required: true,
    },
    purpose: {
      type: String,
      enum: ["deposit", 'withdraw', "transfer", "reversal", "refund"],
      required: true,
    },
    description: String,
    currency: {
      type: String,
      enum: ["THB", "LAK", "USD"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    externalRef: String,
    accountId: {
      type: String,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    remark: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
