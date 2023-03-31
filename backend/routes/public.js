const express = require("express");

import { authen } from "../controllers/authen.js"; 
import { login } from "../controllers/login.js";
import { getPackageDetailByTracking } from "../controllers/package.js";
import { getRouteDetail } from "../controllers/route.js";
import { getTrackingLogByTrackingNumber } from "../controllers/trackingLog.js";

const router = express.Router();

router.post("/authen", authen);
router.post("/login", login);
router.get("/package-detail", getPackageDetailByTracking);
router.get("/trackinglog", getTrackingLogByTrackingNumber);
router.get("/route-detail", getRouteDetail);





export default router;
