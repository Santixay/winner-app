const express = require("express");

const {
  getRoleDetail,
  getRoleList,
  patchRole,
  storeRole,
} = require("../controllers/role.js");

const router = express.Router();

router.get("/detail", getRoleDetail);
router.get("/list", getRoleList);
router.post("/store", storeRole);
router.patch("/patch", patchRole);
router.delete("/delete/:id");

module.exports = router;
