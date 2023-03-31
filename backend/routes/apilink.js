const express = require("express");

import { getApilinks } from "../controllers/apilink.js";

const router = express.Router();

router.get("/list", getApilinks)

export default router;
