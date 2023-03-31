const express = require("express");

import {
 getDistrics,
 getProvinces,
 getVillages,
    getRouteByProvinceID,
} from "../controllers/location.js";

const router = express.Router();

router.get("/villages", getVillages);
router.get("/districts", getDistrics)
router.get("/provinces", getProvinces)
router.get("/get-route-by-province", getRouteByProvinceID)

export default router;
