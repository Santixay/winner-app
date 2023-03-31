const express = require("express");

const { getApilinks } = require("../controllers/apilink.js");

const router = express.Router();

router.get("/list", getApilinks);

module.exports = router;
