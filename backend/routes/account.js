const express = require("express");

const {
  getAccount,
  getAccounts,
  storeAccount,
  patchAccount,
  softDelete,
  reactivate,
} = require("../controllers/account.js");

const router = express.Router();

router.post("/store", storeAccount);
router.get("/list", getAccounts);
router.get("/detail", getAccount);
router.patch("/patch/:id", patchAccount);
router.delete("/delete/:id", softDelete);
router.post("/reactivate/:id", reactivate);

module.exports = router;
