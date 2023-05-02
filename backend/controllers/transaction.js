const joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const Account = require("../models/Account.js");
const Transaction = require("../models/Transaction.js");
const TransactionDetail = require("../models/TransactionDetail.js");

// all parameters must validated before pass to this function
// async function _updateAccount(
//   txn_type,
//   purpose,
//   accountId,
//   amount,
//   currency,
//   reference,
//   description = "",
//   remark = ""
// ) {
//   try {
//     const account = await Account.findOne({ id: accountId });
//     if (!account) {
//       return {
//         success: false,
//         message: "Account does not exist",
//       };
//     }

//     var balanceBefore;
//     var balanceAfter;

//     if (currency === "THB") {
//       balanceBefore = account.THB;
//     } else if (currency === "LAK") {
//       balanceBefore = account.LAK;
//     } else {
//       balanceBefore = account.USD;
//     }
//     balanceAfter =
//       txn_type === "credit"
//         ? Number(balanceBefore) + Number(amount)
//         : Number(balanceBefore) - Number(amount);

//     const transaction = await _storeTransaction(
//       txn_type,
//       purpose,
//       currency,
//       amount,
//       reference,
//       accountId,
//       balanceBefore,
//       balanceAfter,
//       description,
//       remark
//     );

//     return transaction;
//   } catch (error) {
//     return { success: false, message: error };
//   }
// }

// all parameters must validated before pass to this function
// async function _storeTransaction(
//   txn_type,
//   purpose,
//   currency,
//   amount,
//   reference,
//   accountId,
//   balanceBefore,
//   balanceAfter,
//   description = "",
//   remark = ""
// ) {
//   try {
//     const result = new Promise(async (resolve, reject) => {
//       const count = await Transaction.countDocuments({});
//       const id = "TXN" + Number(count).toString().padStart(8, "0");
//       console.log("Transaction.create()");
//       Transaction.create(
//         {
//           id,
//           txn_type,
//           purpose,
//           currency,
//           amount,
//           reference,
//           accountId,
//           balanceBefore,
//           balanceAfter,
//           description,
//           remark,
//         },
//         async (error, transaction) => {
//           console.log("🚀 ~ file: transaction.js:98 ~ error:", error);
//           if (error) return { success: false, message: error };
//           console.log("we are here");

//           const filter = { id: accountId };
//           var updateBalance = {};
//           switch (currency) {
//             case "THB":
//               updateBalance.THB = balanceAfter;
//               break;
//             case "LAK":
//               updateBalance.LAK = balanceAfter;
//               break;
//             default:
//               updateBalance.USD = balanceAfter;
//               break;
//           }

//           console.log("update account");
//           const result = await Account.findOneAndUpdate(filter, updateBalance, {
//             returnOriginal: false,
//           });

//           resolve({
//             success: true,
//             message: `${purpose} - ${txn_type} successful`,
//             account: result,
//             transaction,
//           });
//         }
//       );
//     });
//     return result;
//   } catch (error) {
//     return { success: false, message: error };
//   }
// }

async function _getCurrentBalance(accountId, currency) {
  var result = await Transaction.aggregate([
    { $match: { $and: [{ accountId }, { currency }] } },
    { $group: { _id: "$txn_type", sum: { $sum: { $toInt: "$amount" } } } },
  ]);

  if (!result.find((item) => item._id === "credit")) {
    result.push({ _id: "credit", sum: 0 });
  }
  if (!result.find((item) => item._id === "debit")) {
    result.push({ _id: "debit", sum: 0 });
  }
  return result;
}

async function _storeTransactionDetail(detail, image, reference) {
  const count = await TransactionDetail.countDocuments({});
  const id = "TXND" + Number(count).toString().padStart(8, "0");
  try {
    TransactionDetail.create(
      { id, detail, image, reference },
      (error, transactionDetail) => {
        if (error) {
          Transaction.deleteMany({ reference });
          return { success: false, message: error };
        }
        return {
          success: true,
          message: "TransactionDetail has been saved successfully.",
          transactionDetail,
        };
      }
    );
  } catch (error) {
    Transaction.deleteMany({ reference });
    return {
      success: false,
      message: "Transaction failed, can't save transaction detail.",
    };
  }
}

// all parameters must validated before pass to this function
async function _transactionProcess(
  purpose,
  txn_type,
  accountId,
  amount,
  currency,
  reference,
  transactionDetail = null,
  description = "",
  remark = ""
) {
  try {
    const balance = await _getCurrentBalance(accountId, currency);
    const debit = balance.find((item) => item._id === "debit").sum;
    const credit = balance.find((item) => item._id === "credit").sum;
    var balanceBefore = Number(credit) - Number(debit);
    var balanceAfter = 0;
    console.log("balance:", balance);
    console.log("balanceBefore:", balanceBefore);

    if (
      purpose === "transfer" &&
      txn_type === "debit" &&
      balanceBefore < amount
    ) {
      return {
        success: false,
        message: `You dose not have enough balance to transfer. current balance: ${balanceBefore}`,
      };
    }

    balanceAfter =
      txn_type === "credit"
        ? Number(balanceBefore) + Number(amount)
        : Number(balanceBefore) - Number(amount);
    try {
      const result = new Promise(async (resolve, reject) => {
        var count = await Transaction.countDocuments({});
        const id = "TXN" + Number(count).toString().padStart(8, "0");
        // console.log("Transaction.create()");
        Transaction.create(
          {
            id,
            txn_type,
            purpose,
            currency,
            amount,
            reference,
            accountId,
            balanceBefore,
            balanceAfter,
            description,
            remark,
          },
          async (error, transaction) => {
            if (error) {
              reject({ success: false, message: error });
            }
            // console.log("we are here");

            const filter = { id: accountId };
            var updateBalance = {};
            switch (currency) {
              case "THB":
                updateBalance.THB = balanceAfter;
                break;
              case "LAK":
                updateBalance.LAK = balanceAfter;
                break;
              default:
                updateBalance.USD = balanceAfter;
                break;
            }

            console.log("update account");
            const updateResult = await Account.findOneAndUpdate(
              filter,
              updateBalance,
              {
                returnOriginal: false,
              }
            );

            resolve({
              success: true,
              message: `${purpose} - ${txn_type} successful`,
              account: updateResult,
              transaction,
            });
          }
        );
      });
      if (!result.success) return result;

      console.log("transactionDetail", transactionDetail);
      if (transactionDetail !== null) {
        console.lof("transactionDetail !== null ");
        if (transactionDetail.detail && transactionDetail.image) {
          const txnDetail = await _storeTransactionDetail(
            transactionDetail.detail,
            transactionDetail.image
          );
          if (!txnDetail.success) return txnDetail;
        } else {
          return {
            success: false,
            message:
              "TransactionDetail saving failed, TransactionDetail.detail and TransactionDetail.image is required",
          };
        }
      }
      // console.log(result);

      return { success: true, result };
    } catch (error) {
      return { success: false, message: error.message, error: error };
    }
  } catch (error) {
    console.log("🚀 ~ file: transaction.js:203 ~ error:", error);
    return {
      success: false,
      error: "there was error please check console.log",
    };
  }
}

async function _reqValidation(req, purpose = "") {
  var { accountId, amount, currency, senderId, recipientId } = req.body;
  if (!!currency) currency = currency.toString().toUpperCase();

  if (purpose === "transfer") {
    const transferSchema = joi.object({
      senderId: joi.string().required(),
      recipientId: joi.string().required(),
      amount: joi.number().min(1).required(),
      currency: joi.string().valid("THB", "LAK", "USD").required(),
    });
    const transferValidation = transferSchema.validate({
      senderId,
      recipientId,
      amount,
      currency,
    });
    if (transferValidation.error) {
      return {
        success: false,
        message: `Transaction validation failed, ${transferValidation.error.details[0].message}`,
        error: transferValidation.error,
      };
    }

    const senderAccount = await Account.findOne({ id: senderId });
    if (!senderAccount) {
      return {
        success: false,
        message: "senderId does not exist",
      };
    }

    const recipientAccount = await Account.findOne({ id: recipientId });
    if (!recipientAccount) {
      return {
        success: false,
        message: "recipientId does not exist",
      };
    }

    return { success: true, message: "Validation success" };
  }

  const schema = joi.object({
    accountId: joi.string().required(),
    amount: joi.number().min(1).required(),
    currency: joi.string().valid("THB", "LAK", "USD").required(),
  });
  const validation = schema.validate({
    accountId,
    amount,
    currency,
  });

  if (validation.error) {
    return {
      success: false,
      message: `Transaction validation failed, ${validation.error.details[0].message}`,
      error: validation.error,
    };
  }

  const account = await Account.findOne({ id: accountId });
  if (!account) {
    return {
      success: false,
      message: "Account does not exist",
    };
  }

  return { success: true, message: "Validation success" };
}

module.exports = {
  deposit: async (req, res) => {
    const validator = await _reqValidation(req);
    if (!validator.success) {
      return res.status(400).json(validator);
    }
    const { accountId, amount, description, remark, transactionDetail } =
      req.body;
    const currency = req.body.currency.toString().toUpperCase();

    try {
      const reference = uuidv4();
      const purpose = "deposit";
      const txn_type = "credit";
      const result = await _transactionProcess(
        purpose,
        txn_type,
        accountId,
        amount,
        currency,
        reference,
        transactionDetail,
        description,
        remark
      );

      if (!result.success) return res.status(400).json(result);

      return res.status(200).json(result);
    } catch (error) {
      console.log("🚀 ~ file: transaction.js:255 ~ deposit: ~ error:", error);
      res.status(409).json({ message: error.message });
    }
  },
  withdraw: async (req, res) => {
    const validator = await _reqValidation(req);

    if (!validator.success) {
      return res.status(400).json(validator);
    }
    const { accountId, amount, description, remark, transactionDetail } =
      req.body;
    const currency = req.body.currency.toString().toUpperCase();
    try {
      const reference = uuidv4();
      const purpose = "withdrawal";
      const txn_type = "debit";
      const result = await _transactionProcess(
        purpose,
        txn_type,
        accountId,
        amount,
        currency,
        reference,
        transactionDetail,
        description,
        remark
      );

      if (!result.success) return res.status(400).json(result);

      return res.status(200).json(result);
    } catch (error) {
      console.log("🚀 ~ file: transaction.js:304 ~ withdraw: ~ error:", error);
      res.status(409).json({ message: error.message });
    }
  },
  transfer: async (req, res) => {
    const purpose = "transfer";
    const validator = await _reqValidation(req, purpose);

    if (!validator.success) {
      return res.status(400).json(validator);
    }
    const {
      senderId,
      recipientId,
      amount,
      description,
      remark,
      transactionDetail,
    } = req.body;
    const currency = req.body.currency.toString().toUpperCase();
    const reference = uuidv4();

    // const currentBalance = await _getCurrentBalance;

    try {
      const debitResult = await _transactionProcess(
        purpose,
        "debit",
        senderId,
        amount,
        currency,
        reference,
        transactionDetail,
        description,
        remark
      );

      if (debitResult.success) {
        const creditResult = await _transactionProcess(
          purpose,
          "credit",
          recipientId,
          amount,
          currency,
          reference,
          transactionDetail,
          description,
          remark
        );

        if (creditResult.success) {
          res
            .status(200)
            .json({ success: true, message: "Transfering successfully." });
        } else {
          Transaction.deleteMany({ reference });
          return res.status(400).json(creditResult);
        }
      } else {
        return res.status(400).json(debitResult);
      }
    } catch (error) {
      console.log("🚀 ~ file: transaction.js:489 ~ transfer: ~ error:", error);
      res.status(409).json({ message: error.message });
    }
  },
  reversal: async (req, res) => {
    const purpose = "reversal";
    const txn_reference = uuidv4();
    const { reference } = req.params;
    const { transactionDetail, description } = req.body;
    // const transactionDetail = null;
    // const description = null;

    try {
      const transactions = await Transaction.find({ reference });
      if (transactions.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "transaction reference not found" });
      }

      const transactionsArray = transactions.map(async (transaction) => {
        let remark = `originalReference: ${transaction.reference}`;
        if (transaction.txn_type === "debit") {
          const debitReversal = await _transactionProcess(
            purpose,
            "credit",
            transaction.accountId,
            transaction.amount,
            transaction.currency,
            txn_reference,
            transactionDetail,
            description,
            remark
          );
          console.log(
            "🚀 ~ file: transaction.js:533 ~ transactionsArray ~ debitReversal:",
            debitReversal
          );

          return debitReversal;
        } else {
          const creditReversal = await _transactionProcess(
            purpose,
            "debit",
            transaction.accountId,
            transaction.amount,
            transaction.currency,
            txn_reference,
            transactionDetail,
            description,
            remark
          );
          console.log(
            "🚀 ~ file: transaction.js:548 ~ transactionsArray ~ creditReversal:",
            creditReversal
          );

          return creditReversal;
        }
      });
      const reversalResult = await Promise.all(transactionsArray);

      const failedTxns = reversalResult.filter((result) => !result.success);
      if (failedTxns.length) {
        Transaction.deleteMany({ reference: txn_reference });
        return res.status(400).json({
          success: false,
          message: "Reversal failed",
          result: reversalResult,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Reversal successful",
        });
      }
    } catch (error) {
      console.log(error);
      Transaction.deleteMany({ reference: txn_reference });
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
  refund: async (req, res) => {},
  getTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      let transaction = await Transaction.findOne({ id });
      if (transaction === null)
        return res.status(202).json({ message: "data not found!" });

      let detail = await TransactionDetail.findOne({
        reference: transaction.reference,
      });
      if (detail !== null) transaction.detail = detail;
      res.status(200).json(transaction);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },
  getTransactionByRef: async (req, res) => {
    try {
      const { reference } = req.params;
      const transactions = await Transaction.find({ reference });
      if (transactions === null) {
        res.status(202).json({ message: "data not found!" });
      } else {
        res.status(200).json(transactions);
      }
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },
  getTransactionByAccountId: async (req, res) => {
    try {
      const { accountId } = req.params;
      const transactions = await Transaction.find({ accountId });
      if (transactions === null) {
        res.status(202).json({ message: "data not found!" });
      } else {
        res.status(200).json(transactions);
      }
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },
};
