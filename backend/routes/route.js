const express = require("express");

const { getRouteDetail, getRouteList } = require("../controllers/route.js");

const router = express.Router();

router.get("/detail", getRouteDetail);
router.get("/list", getRouteList);

module.exports = router;
