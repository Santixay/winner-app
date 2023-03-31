const express = require("express");

const {
 getDistrics,
 getProvinces,
 getVillages,
    getRouteByProvinceID,
} = require("../controllers/location.js");

const router = express.Router();

router.get("/villages", getVillages);
router.get("/districts", getDistrics)
router.get("/provinces", getProvinces)
router.get("/get-route-by-province", getRouteByProvinceID)

module.exports = router;
