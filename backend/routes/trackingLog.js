const express = require("express");

const {
  getTrackingLog,
  getTrackingLogByTrackingNumber,
  storeTrackingLog,
} = require("../controllers/trackingLog.js");

const router = express.Router();

router.post("/store", storeTrackingLog);
router.get("/list", getTrackingLog);
router.get("/log", getTrackingLogByTrackingNumber);

module.exports = router;
