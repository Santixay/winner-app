const express = require("express");

const {
  getFinalStationList,
  getSationDetailByStationId,
  getStationList,
} = require("../controllers/station.js");
const { authen } = require("../middleware/authenticate.js");

const router = express.Router();

router.get("/list", authen, getStationList);
router.get("/detail", authen, getSationDetailByStationId);
router.get("/final", authen, getFinalStationList);

module.exports = router;
