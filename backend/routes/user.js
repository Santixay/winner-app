const express = require("express");

const {
  getUsers,
  getUserId,
  storeUser,
  patchUser,
  deleteUser,
} = require("../controllers/user.js");

const router = express.Router();

router.get("/list", getUsers);
router.get("/:id", getUserId);
router.post("/store", storeUser);
router.patch("/patch", patchUser);
router.delete("/delete/:id", deleteUser);

module.exports = router;
