const express = require("express");

import { getRouteDetail, getRouteList } from "../controllers/route.js";

const router = express.Router();

router.get("/detail", getRouteDetail);
router.get("/list", getRouteList)

export default router;
