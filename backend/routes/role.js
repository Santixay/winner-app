const express = require("express");

import { getRoleDetail, getRoleList, patchRole, storeRole } from "../controllers/role.js";

const router = express.Router();

router.get("/detail", getRoleDetail);
router.get("/list", getRoleList);
router.post('/store', storeRole);
router.patch('/patch', patchRole);
router.delete('/delete/:id');


export default router;
