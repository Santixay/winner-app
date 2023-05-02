const express = require("express");

const {
  deposit,
  getTransaction,
  getTransactionByAccountId,
  getTransactionByRef,
  withdraw,
  transfer,
  reversal,
} = require("../controllers/transaction");

const router = express.Router();

router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.post("/transfer", transfer);
router.post("/reversal/:reference", reversal)

router.get("/:id", getTransaction);
router.get("/account/:accountId", getTransactionByAccountId);
router.get("/ref/:reference", getTransactionByRef);

module.exports = router;
