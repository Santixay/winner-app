const express = require("express");

const {
  deposit,
  getTransaction,
  getTransactionByAccountId,
  getTransactionByRef,
  withdraw,
} = require("../controllers/transaction");

const router = express.Router();

router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.get("/:id", getTransaction);
router.get("/account/:accountId", getTransactionByAccountId);
router.get("/ref/:reference", getTransactionByRef);

module.exports = router;
