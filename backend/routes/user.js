const express = require("express");

import {
  getUsers,
  getUserId,
  storeUser,
  patchUser,
  deleteUser,
} from "../controllers/user.js";


const router = express.Router();

router.get("/list", getUsers);
router.get("/:id" , getUserId);
router.post("/store", storeUser);
router.patch("/patch", patchUser);
router.delete("/delete/:id", deleteUser);

export default router;
