const express = require("express");

import { getFinalStationList, getSationDetailByStationId, getStationList } from "../controllers/station.js";
import { authen } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/list", authen, getStationList)
router.get("/detail",authen, getSationDetailByStationId)
router.get("/final",authen, getFinalStationList)

export default router;