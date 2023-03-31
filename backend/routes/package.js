const express = require("express");

import {
  getPackages,
  getPackageDetailById,
  storePackage,
  deletePackage,
  patchPackage,
  getPackageDetailByTracking,
  getPackageListByStationAndDate,
  getSumPackagesForWhatsApp,
  getSumPackagesForDelivered,
} from "../controllers/package.js";
import { authen } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/list", authen, getPackages);
router.get("/id/:id",authen, getPackageDetailById);
router.post("/store",authen, storePackage);
router.patch("/patch",authen, patchPackage);
router.delete("/delete/:id",authen, deletePackage);
router.get("/tracking", getPackageDetailByTracking);
router.get("/list-by-station-and-date",authen, getPackageListByStationAndDate)
router.get("/sumpackages",authen, getSumPackagesForWhatsApp)
router.get("/sumpackages-delivered",authen, getSumPackagesForDelivered)


export default router;
