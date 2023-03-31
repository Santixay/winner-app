const express = require("express");

const { login } = require("../controllers/login.js");
const { getPackageDetailByTracking } = require("../controllers/package.js");
const { getRouteDetail } = require("../controllers/route.js");
const { getTrackingLogByTrackingNumber } = require("../controllers/trackingLog.js");

const router = express.Router();

router.post("/login", login);
router.get("/package-detail", getPackageDetailByTracking);
router.get("/trackinglog", getTrackingLogByTrackingNumber);
router.get("/route-detail", getRouteDetail);

module.exports =  router;
