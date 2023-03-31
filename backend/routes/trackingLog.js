const express = require("express");

import { getTrackingLog, getTrackingLogByTrackingNumber, storeTrackingLog } from "../controllers/trackingLog.js";
import { authen } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/store", authen, storeTrackingLog)
router.get("/list",authen, getTrackingLog)
router.get("/log", getTrackingLogByTrackingNumber)

export default router;