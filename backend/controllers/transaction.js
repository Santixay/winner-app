const joi = require("joi");
const { v4: uuidv4 } = require("uuid");

const Account = require("../models/Account.js");
const Transaction = require("../models/Transaction.js");
const TransactionDetail = require("../models/TransactionDetail.js");

// all parameters must validated before pass to this function
async function _updateAccount(
  txn_type,
  purpose,
  accountId,
  amount,
  currency,
  reference,
  description = "",
  remark = ""
) {
  try {
    const account = await Account.findOne({ id: accountId });
    if (!account) {
      return {
        success: false,
        message: "Account does not exist",
      };
    }

    var balanceBefore;
    var balanceAfter;

    if (currency === "THB") {
      balanceBefore = account.THB;
    } else if (currency === "LAK") {
      balanceBefore = account.LAK;
    } else {
      balanceBefore = account.USD;
    }
    balanceAfter =
      txn_type === "credit"
        ? Number(balanceBefore) + Number(amount)
        : Number(balanceBefore) - Number(amount);

    const transaction = await _storeTransaction(
      txn_type,
      purpose,
      currency,
      amount,
      reference,
      accountId,
      balanceBefore,
      balanceAfter,
      description,
      remark
    );

    return transaction;
  } catch (error) {
    return { success: false, message: error };
  }
}

// all parameters must validated before pass to this function
async function _storeTransaction(
  txn_type,
  purpose,
  currency,
  amount,
  reference,
  accountId,
  balanceBefore,
  balanceAfter,
  description = "",
  remark = ""
) {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await Transaction.countDocuments({});
      const id = "TXN" + Number(count).toString().padStart(8, "0");
      console.log("Transaction.create()");
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
          console.log("🚀 ~ file: transaction.js:98 ~ error:", error);
          if (error) return { success: false, message: error };
          console.log("we are here");

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
          const result = await Account.findOneAndUpdate(filter, updateBalance, {
            returnOriginal: false,
          });

          resolve({
            success: true,
            message: `${purpose} - ${txn_type} successful`,
            account: result,
            transaction,
          });
        }
      );
    } catch (error) {
      reject({ success: false, message: error });
    }
  });
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
    const creditResult = await _updateAccount(
      txn_type,
      purpose,
      accountId,
      amount,
      currency,
      reference,
      description,
      remark
    );

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

    return { success: true, creditResult };
  } catch (error) {
    console.log("🚀 ~ file: transaction.js:203 ~ error:", error)    
    return {
      success: false,
      error: "there was error please check console.log",
    };
  }
}

module.exports = {
  deposit: async (req, res) => {
    const {
      accountId,
      amount,
      currency,
      description,
      remark,
      transactionDetail,
    } = req.body;   

    const schema = joi.object({
      accountId: joi.string().required(),
      amount: joi.number().min(1).required(),
      currency: joi.string().valid("THB", "LAK", "USD").required(),
    });
    const validation = schema.validate({ accountId, amount, currency });
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: `Transaction validation failed, ${validation.error.details[0].message}`,
        error: validation.error,
      });
    }

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
    const {
      accountId,
      amount,
      currency,
      description,
      remark,
      transactionDetail,
    } = req.body;
    const schema = joi.object({
      accountId: joi.string().required(),
      amount: joi.number().min(1).required(),
      currency: joi.string().valid("THB", "LAK", "USD").required(),
    });
    const validation = schema.validate({ accountId, amount, currency });
    if (validation.error) {
      return {
        success: false,
        message: `Transaction validation failed, ${validation.error.details[0].message}`,
        error: validation.error,
      };
    }

    try {
      const reference = uuidv4();
      const purpose = "withdraw";
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
