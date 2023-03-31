const express = require("express");

const {
  getCustomers,
  getCustomerId,
  storeCustomer,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customer.js");

const router = express.Router();

router.get("/list", getCustomers);
router.get("/customerid/:id", getCustomerId);
router.post("/store", storeCustomer);
router.patch("/patch", updateCustomer);
router.delete("/delete/:id", deleteCustomer)


module.exports = router;
