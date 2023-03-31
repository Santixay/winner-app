const express = require("express");

const { sendMessage } = require("../controllers/whatsappApi.js");

const router = express.Router();

router.post("/sendmessage/:phone", sendMessage);

module.exports = router;
