const express = require("express");

import { sendMessage } from "../controllers/whatsappApi.js";

const router = express.Router();

router.post("/sendmessage/:phone", sendMessage);

export default router;
